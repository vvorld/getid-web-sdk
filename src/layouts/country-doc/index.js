import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import TranslationsContext from '../../context/TranslationsContext';
import Footer from '../../components/blocks/footer/footer';
import Radiobutton from '../../components/inputs/radio-button';
import '../form/form.css';
import Header from "../../components/blocks/header/header";

const docTypeMapping = {
  passport: 'Passport',
  'id-card': 'ID Card',
  'residence-permit': 'Residence Permit',
  'driving-licence': 'Drivers License',
  visa: 'Visa',
};
const getDocumentName = (type) => docTypeMapping[type] || type;

const mapCountryValues = (countriesAndDocs) => Object.entries(countriesAndDocs)
  .map(([value, { name, documents }]) => ({ name, value, documents }));

const CountryAndDocument = ({
  countryDocuments, country, documentType, finishStep, prevStep, componentName,
}) => {
  const { translations } = useContext(TranslationsContext);
  const placeholder = translations['CountryAndDocument_country-placeholder'];
  const countries = mapCountryValues(countryDocuments);
  const [currValue, setValue] = useState(country);
  const [currDocumentType, setDocumentType] = useState(documentType);

  const countryInfo = countryDocuments[currValue];
  const documents = (countryInfo && countryInfo.documents) || [];
  const changeCountry = (countryVal) => {
    setValue(countryVal);
    setDocumentType('');
  };
  const changeDocumentType = (dt) => {
    setDocumentType(dt);
  };

  return (
    <>
      <Header componentName={componentName} />
      <div>
        <select
          value={currValue}
          onChange={(e) => changeCountry(e.target.value)}
          placeholder={placeholder}
        >
          <option value="">Country</option>
          {countries.map(({ value, name }) => (
            <option key={name} value={value}>{name}</option>
          ))}
        </select>

      </div>
      <div>
        {documents && documents.map((docType) => (
          <div key={docType.name} className="getid-form__input-wrapper">
            <Radiobutton
              name={getDocumentName(docType.name)}
              checked={docType === currDocumentType}
              onChange={() => changeDocumentType(docType)}
            />
          </div>
        ))}
      </div>

      <Footer
        next={{ onClick: () => finishStep({}) }}
        back={{ onClick: prevStep }}
      />
    </>
  );
};

CountryAndDocument.propTypes = {
  countryDocuments: PropTypes.object,
  country: PropTypes.string,
  documentType: PropTypes.string,
  finishStep: PropTypes.func,
  prevStep: PropTypes.func,
};

CountryAndDocument.defaultProps = {
  countryDocuments: {},
  country: '',
  documentType: '',
  finishStep: null,
  prevStep: null,
};

export default CountryAndDocument;
