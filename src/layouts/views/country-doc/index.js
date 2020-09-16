import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Grid, RadioGroup } from '@material-ui/core';
import { Select, RadioButton } from '../../../components/inputs';
import {
  getFormValues,
  getCountryAndDocsValues,
  getIdCaptureBackIndex,
} from '../../../store/selectors';
import actions from '../../../store/actions';
import { mapCountryValues } from '../../../helpers/generic';
import { docTypeMapping } from '../../../constants/document-types';
import TranslationsContext from '../../../context/TranslationsContext';

class CountryAndDocument extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
    };
    this.initialStep = this.props.initialStep;
    this.initialBSIndex = this.props.initialBSIndex;
  }

  componentDidMount() {
    const {
      addCountriesAndDocs, countriesAndDocsList,
    } = this.props;
    addCountriesAndDocs(countriesAndDocsList);
    this.setFieldsValues();
  }

  componentDidUpdate() {
    const {
      countriesAndDocs, currentStep, fieldValues,
    } = this.props;

    const countryList = Object.keys(countriesAndDocs).length && countriesAndDocs;
    const currentValues = Object.keys(fieldValues[currentStep]).length && fieldValues[currentStep];

    if (currentValues && countryList) {
      if (countryList[currentValues.Country.value] && currentValues.DocumentType.value) {
        if (!this.getCurrentDocumentProperties()) {
          this.setEmptyDocumentType();
        }
        this.changeFlowBasedOnDocumentComposition();
      }

      this.checkForSupportedValues(currentValues, countryList);
    }
  }

  setBackStepIndexAndStep = () => {
    const { flow, setIdCaptureBack } = this.props;
    const stepWithIdCaptureBack = flow
      .find((item) => item.component.includes('IdCaptureBack')) || {};
    setIdCaptureBack(flow.indexOf(stepWithIdCaptureBack) || -1);
  };

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
      const countryField = documentData.find((f) => f.name === 'Country');
      const docTypeField = documentData.find((f) => f.name === 'DocumentType');

      if (countryField && countryField.name && countryField.value) {
        addField(countryField.name, countryField.value, currentStep, true, 'text');

        if (docTypeField && docTypeField.name && docTypeField.value) {
          addField(docTypeField.name, docTypeField.value, currentStep, true);
        } else {
          this.setFirstDocumentOfTheCountry(countryField.value);
        }
      } else {
        this.setEmptyCountry();
        this.setEmptyDocumentType();
      }

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

  handleCountryChange = (event) => {
    const { currentStep, addField } = this.props;
    const country = event.target.value;
    addField('Country', country, currentStep, true, 'text');
    this.setFirstDocumentOfTheCountry(country);
  }

  setFirstDocumentOfTheCountry = (country) => {
    const { currentStep, countriesAndDocsList, addField } = this.props;
    const { documents } = countriesAndDocsList[country];
    addField('DocumentType', documents[0].name, currentStep, true, 'text');
  }

  setNewVal = (key) => (event) => {
    const { currentStep } = this.props;
    this.props.addField(key, event.target.value, currentStep, true, 'text');
  }

  setEmptyDocumentType = () => {
    const { currentStep, addField } = this.props;
    addField('DocumentType', '', currentStep, true, 'text');
  };

  getCurrentDocumentProperties = () => {
    const {
      fieldValues,
      currentStep,
      countriesAndDocs,
    } = this.props;

    const docType = fieldValues[currentStep].DocumentType.value;

    const country = mapCountryValues(countriesAndDocs)
      .find((item) => item.value === fieldValues[currentStep].Country.value);
    return country
      && country.documents.find((item) => item.name === docType);
  };

  changeFlowBasedOnDocumentComposition = () => {
    const {
      flow,
      setFlow,
      idCaptureBackIndex,
    } = this.props;

    if (this.initialBSIndex < 0 || !this.initialStep) {
      return;
    }

    const duplicatedFlow = flow;
    const { composition } = this.getCurrentDocumentProperties() || '';

    if (composition === 'single' && idCaptureBackIndex !== -1) {
      duplicatedFlow.splice(idCaptureBackIndex, 1);
      this.setBackStepIndexAndStep();
      setFlow(duplicatedFlow);
      return;
    }

    if (composition !== 'single' && idCaptureBackIndex < 0) {
      duplicatedFlow.splice(this.initialBSIndex, 0, this.initialStep);
      this.setBackStepIndexAndStep();
      setFlow(duplicatedFlow);
    }
  };

  generateRadioButtons = (document) => {
    if (!document || !docTypeMapping[document]) return null;

    const {
      fieldValues, currentStep,
    } = this.props;

    return (
      <RadioButton
        selectedvalue={fieldValues[currentStep].DocumentType.value}
        key={`control-${document}`}
        value={document}
        label={docTypeMapping[document]}
      />
    );
  };

  render() {
    const { loading } = this.state;
    const {
      countriesAndDocs,
      fieldValues,
      currentStep,
      currentComponent,
    } = this.props;

    const { translations } = this.context;
    const placeholder = translations['CountryAndDocument_country-placeholder'];
    const values = fieldValues[currentStep];

    if (loading && !values) {
      return null;
    }

    const currentDocumentType = values.DocumentType.value;
    const currentCountryValue = values.Country.value;

    const { documents } = countriesAndDocs[currentCountryValue] || [];
    const { length } = currentComponent.component;

    const fieldWidth = length > 1 ? 10 : 5;

    return (
      <Grid justify="center" alignItems="center" container data-role="blockDocument">
        <Grid item xs={11} sm={9} md={fieldWidth}>
          <Select
            items={mapCountryValues(countriesAndDocs)}
            value={currentCountryValue}
            onChange={this.handleCountryChange}
            placeholder={placeholder}
          />

          <RadioGroup value={currentDocumentType} onChange={this.setNewVal('DocumentType')}>
            {documents && documents.map((docType) => this.generateRadioButtons(docType.name))}
          </RadioGroup>
        </Grid>
      </Grid>
    );
  }
}

CountryAndDocument.propTypes = {
  addField: PropTypes.func.isRequired,
  addCountriesAndDocs: PropTypes.func.isRequired,
  setIdCaptureBack: PropTypes.func.isRequired,
  currentStep: PropTypes.number.isRequired,
  idCaptureBackIndex: PropTypes.number.isRequired,
  initialBSIndex: PropTypes.number.isRequired,
  initialStep: PropTypes.object.isRequired,
  fieldValues: PropTypes.object,
  countriesAndDocs: PropTypes.object,
  setFlow: PropTypes.func.isRequired,
  flow: PropTypes.array.isRequired,
  documentData: PropTypes.array,
  currentComponent: PropTypes.object.isRequired,
  countriesAndDocsList: PropTypes.object.isRequired,
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
  idCaptureBackIndex: getIdCaptureBackIndex(state),
});

export default connect(
  mapStateToProps,
  actions,
)(CountryAndDocument);
