import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
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
    const { countriesAndDocs, api, addCountriesAndDocs } = this.props;

    if (!countriesAndDocs || !Object.entries(countriesAndDocs).length) {
      api.getCountryAndDocList().then((data) => {
        addCountriesAndDocs(data.countries);
        this.setState({ loading: false });
      });
    } else {
      this.setState({ loading: false });
    }

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
        documentData.forEach((field) => {
          addField(field.name, field.value, currentStep, true, 'text');
        });
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
        <label>
          <input
            selected={fieldValues[currentStep].DocumentType.value}
            type="radio"
            value={document}
          />
          {docTypeMapping[document]}

        </label>
      );
    };

    render() {
      const { loading } = this.state;
      const {
        countriesAndDocs, fieldValues, currentStep,
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

      return (
        <div data-role="blockDocument">
          <select
            value={currentCountryValue}
            onChange={this.setNewVal('Country')}
            placeholder={placeholder}
          >
            {mapCountryValues(countriesAndDocs).map((x) => (
              <option>{x}</option>
            ))}
          </select>

          <div value={currentDocumentType} onChange={this.setNewVal('DocumentType')}>
            {documents && documents.map((docType) => this.generateRadioButtons(docType.name))}
          </div>
        </div>
      );
    }
}

CountryAndDocument.propTypes = {
  api: PropTypes.object.isRequired,
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
