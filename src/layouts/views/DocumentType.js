import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import RadioGroup from '@material-ui/core/RadioGroup';
import Select from '../../components/Inputs/Select';
import { getFormValues, getCountryAndDocsValues } from '../../store/selectors';
import actions from '../../store/actions';
import {
  mapCountryValues,
} from '../../helpers/tree-builder';
import Radiobutton from '../../components/Inputs/RadioButton';
import apiProvider from '../../services/api';
import { docTypeMapping } from '../../constants/document-types';
import TranslationsContext from '../../context/TranslationsContext';

class DocumentType extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
    };
  }

  componentDidMount() {
    const { countriesAndDocs } = this.props;

    if (!countriesAndDocs || !Object.entries(countriesAndDocs).length) {
      this.getCountryAndDocList().then((data) => {
        this.props.addCountriesAndDocs(data.countries);
        this.setState({ loading: false });
      });
    } else {
      this.setState({ loading: false });
    }

    this.setFieldsValues();
  }

  // eslint-disable-next-line no-unused-vars
  componentDidUpdate(prevProps, state, snapshot) {
    const {
      countriesAndDocs, currentStep, addField, fieldValues,
    } = this.props;

    const countryList = Object.keys(countriesAndDocs).length && countriesAndDocs;
    const currentValues = Object.keys(fieldValues[currentStep]).length && fieldValues[currentStep];

    if (currentValues && countryList) {
      if (countryList[currentValues.Country] && currentValues.DocumentType) {
        this.changeFlowBasedOnDocumentType();
      }

      if (currentValues.Country && !countryList[currentValues.Country]) {
        addField('Country', undefined, currentStep);
        console.error('This country is not supported.');
      }

      if (currentValues.DocumentType && !docTypeMapping[currentValues.DocumentType]) {
        addField('DocumentType', '', currentStep);
        console.error('This document type is not supported.');
      }
    }
  }

  setFieldsValues = () => {
    const {
      documentData, currentStep, addField, fieldValues,
    } = this.props;

    if (!fieldValues[currentStep] && documentData.length) {
      documentData.forEach((field) => { addField(field.name, field.value, currentStep); });
      return;
    }

    if (!fieldValues[currentStep]) {
      addField('Country', undefined, currentStep);
      addField('DocumentType', '', currentStep);
    }
  };

  getCountryAndDocList = () => {
    const { apiUrl } = this.props;
    return apiProvider
      .getCountryAndDocList(apiUrl)
      .then((res) => res.json())
      .then((data) => data);
  };

  setNewCountry = (event) => {
    const { currentStep } = this.props;
    this.props.addField('Country', event.target.value, currentStep);
  };

  setNewDocType = (event) => {
    const { currentStep } = this.props;
    this.props.addField('DocumentType', event.target.value, currentStep);
  };

  changeFlowBasedOnDocumentType = () => {
    const {
      flow, setFlow, fieldValues, currentStep, idCapturebackIndex, countriesAndDocs,
    } = this.props;

    if (idCapturebackIndex < 0) { return; }
    const docType = fieldValues[currentStep].DocumentType;

    const duplicatedFlow = flow;

    const currentBackPhotoStepIndex = flow
      .findIndex((item) => item === 'IdCaptureBack');

    const { composition } = mapCountryValues(countriesAndDocs)
      .find((item) => item.value === fieldValues[currentStep].Country).documents
      .find((item) => item.name === docType);

    if (composition === 'single' && currentBackPhotoStepIndex !== -1) {
      duplicatedFlow.splice(currentBackPhotoStepIndex, 1);
      setFlow(duplicatedFlow);
      return;
    }

    if (composition !== 'single' && currentBackPhotoStepIndex < 0) {
      duplicatedFlow.splice(idCapturebackIndex, 0, 'IdCaptureBack');
      setFlow(duplicatedFlow);
    }
  };

  radioButton = (document) => {
    if (!document || !docTypeMapping[document]) return null;

    const {
      fieldValues, currentStep,
    } = this.props;

    return (
      <Radiobutton
        selectedvalue={fieldValues[currentStep].DocumentType}
        key={`control-${document}`}
        value={document}
        label={docTypeMapping[document]}
      />
    );
  };

  render() {
    const { loading } = this.state;
    const {
      countriesAndDocs, fieldValues, currentStep,
    } = this.props;

    const { translations } = this.context;
    const componentName = this.constructor.name;

    if (!loading && fieldValues[currentStep]) {
      const currentDocumentType = fieldValues[currentStep].DocumentType;
      const currentCountryValue = fieldValues[currentStep].Country;

      const { documents } = countriesAndDocs[currentCountryValue] || [];

      return (
        <Grid container justify="center" data-role="blockDocument">
          <Grid item xs={10} sm={8} md={6}>
            <Select
              items={mapCountryValues(countriesAndDocs)}
              value={currentCountryValue}
              onChange={this.setNewCountry}
              placeholder={translations[`${componentName}_country-placeholder`]}
            />

            <RadioGroup value={currentDocumentType} onChange={this.setNewDocType}>
              { documents && documents.map((docType) => this.radioButton(docType.name)) }
            </RadioGroup>
          </Grid>
        </Grid>
      );
    }
    return null;
  }
}

DocumentType.propTypes = {
  apiUrl: PropTypes.string.isRequired,
  addField: PropTypes.func.isRequired,
  addCountriesAndDocs: PropTypes.func.isRequired,
  currentStep: PropTypes.number.isRequired,
  idCapturebackIndex: PropTypes.number.isRequired,
  fieldValues: PropTypes.object,
  countriesAndDocs: PropTypes.object,
  setFlow: PropTypes.func.isRequired,
  flow: PropTypes.array.isRequired,
  documentData: PropTypes.array,
};

DocumentType.defaultProps = {
  countriesAndDocs: {},
  fieldValues: {},
  documentData: [],
};

DocumentType.contextType = TranslationsContext;

const mapStateToProps = (state) => ({
  countriesAndDocs: getCountryAndDocsValues(state),
  fieldValues: getFormValues(state),
});

export default connect(
  mapStateToProps,
  actions,
)(DocumentType);
