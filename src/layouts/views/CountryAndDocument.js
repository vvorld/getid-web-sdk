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
import { docTypeMapping } from '../../constants/document-types';
import TranslationsContext from '../../context/TranslationsContext';

class CountryAndDocument extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      fieldWidth: 5,
    };
  }

  componentDidMount() {
    const { countriesAndDocs } = this.props;

    if (!countriesAndDocs || !Object.entries(countriesAndDocs).length) {
      this.props.api.getCountryAndDocList().then((data) => {
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
      countriesAndDocs, currentStep, fieldValues,
    } = this.props;

    const countryList = Object.keys(countriesAndDocs).length && countriesAndDocs;
    const currentValues = Object.keys(fieldValues[currentStep]).length && fieldValues[currentStep];

    if (currentValues && countryList) {
      if (countryList[currentValues.Country.value] && currentValues.DocumentType.value) {
        this.changeFlowBasedOnDocumentType();
      }

      this.checkForSupportedValues(currentValues, countryList);
    }
  }

  checkForSupportedValues = (currentValues, countryList) => {
    const { Country, DocumentType } = currentValues;

    if (Country.value && !countryList[Country.value]) {
      this.setEmptyCountry();
      console.error('This country is not supported.');
    }

    if (DocumentType.value && !docTypeMapping[DocumentType.value]) {
      this.setEmptyDocumentType();
      console.error('This document type is not supported.');
    }
  };

  setFieldsValues = () => {
    const {
      documentData, currentStep, addField, fieldValues,
    } = this.props;

    if (!fieldValues[currentStep] && documentData.length) {
      documentData.forEach((field) => { addField(field.name, field.value, currentStep, true); });
      return;
    }

    if (!fieldValues[currentStep]) {
      this.setEmptyCountry();
      this.setEmptyDocumentType();
    }
  };

  setEmptyCountry = () => {
    const { currentStep, addField } = this.props;
    addField('Country', undefined, currentStep, true);
  };

  setEmptyDocumentType = () => {
    const { currentStep, addField } = this.props;
    addField('DocumentType', '', currentStep, true);
  };


  setNewCountry = (event) => {
    const { currentStep } = this.props;
    this.props.addField('Country', event.target.value, currentStep, true);
  };

  setNewDocType = (event) => {
    const { currentStep } = this.props;
    this.props.addField('DocumentType', event.target.value, currentStep, true);
  };

  getDocumentComposition = () => {
    const {
      fieldValues,
      currentStep,
      countriesAndDocs,
    } = this.props;

    const docType = fieldValues[currentStep].DocumentType.value;

    return mapCountryValues(countriesAndDocs)
      .find((item) => item.value === fieldValues[currentStep].Country.value).documents
      .find((item) => item.name === docType);
  };

  changeFlowBasedOnDocumentType = () => {
    const {
      flow,
      setFlow,
      idCapturebackIndex,
      stepWithIdCaptureBack,
    } = this.props;

    if (idCapturebackIndex < 0 || !stepWithIdCaptureBack) { return; }

    const duplicatedFlow = flow;
    const currentBackPhotoStepIndex = flow.indexOf(stepWithIdCaptureBack);
    const { composition } = this.getDocumentComposition();

    if (composition === 'single' && currentBackPhotoStepIndex !== -1) {
      duplicatedFlow.splice(currentBackPhotoStepIndex, 1);
      setFlow(duplicatedFlow);
      return;
    }

    if (composition !== 'single' && currentBackPhotoStepIndex < 0) {
      duplicatedFlow.splice(idCapturebackIndex, 0, stepWithIdCaptureBack);
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
        selectedvalue={fieldValues[currentStep].DocumentType.value}
        key={`control-${document}`}
        value={document}
        label={docTypeMapping[document]}
      />
    );
  };

  render() {
    const { loading, fieldWidth } = this.state;
    const {
      countriesAndDocs, fieldValues, currentStep, currentComponent,
    } = this.props;

    const { translations } = this.context;
    const placeholder = translations['CountryAndDocument_country-placeholder'];

    if (!loading && fieldValues[currentStep]) {
      const currentDocumentType = fieldValues[currentStep].DocumentType.value;
      const currentCountryValue = fieldValues[currentStep].Country.value;

      const { documents } = countriesAndDocs[currentCountryValue] || [];
      const { length } = currentComponent.component;

      return (
        <Grid justify="center" alignItems="center" container spacing={2} data-role="blockDocument">
          <Grid item xs={11} sm={fieldWidth * length}>
            <Select
              items={mapCountryValues(countriesAndDocs)}
              value={currentCountryValue}
              onChange={this.setNewCountry}
              placeholder={placeholder}
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

CountryAndDocument.propTypes = {
  api: PropTypes.object.isRequired,
  addField: PropTypes.func.isRequired,
  addCountriesAndDocs: PropTypes.func.isRequired,
  currentStep: PropTypes.number.isRequired,
  idCapturebackIndex: PropTypes.number.isRequired,
  stepWithIdCaptureBack: PropTypes.object.isRequired,
  fieldValues: PropTypes.object,
  countriesAndDocs: PropTypes.object,
  setFlow: PropTypes.func.isRequired,
  flow: PropTypes.array.isRequired,
  documentData: PropTypes.array,
  currentComponent: PropTypes.object.isRequired,
};

CountryAndDocument.defaultProps = {
  countriesAndDocs: {},
  fieldValues: {},
  documentData: [],
};

CountryAndDocument.contextType = TranslationsContext;

const mapStateToProps = (state) => ({
  countriesAndDocs: getCountryAndDocsValues(state),
  fieldValues: getFormValues(state),
});

export default connect(
  mapStateToProps,
  actions,
)(CountryAndDocument);
