import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import TranslationsContext from '../../context/TranslationsContext';
import Footer from '../../components/blocks/footer/footer';

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
  countryDocuments, country, documentType, actions,
}) => {
  console.log(actions);
  const { translations } = useContext(TranslationsContext);
  const placeholder = translations['CountryAndDocument_country-placeholder'];
  const countries = mapCountryValues(countryDocuments);
  const [currValue, setValue] = useState(country);
  const [currDocumentType, setDocumentType] = useState(documentType);

  const countryInfo = countryDocuments[currValue];
  const documents = countryInfo && countryInfo.documents || [];
  const changeCountry = (cntr) => {
    setValue(cntr);
    setDocumentType('');
  };
  const changeDocumentType = (dt) => {
    setDocumentType(dt);
  };
  return (
    <>
      <div>
        <select
          value={currValue}
          onChange={(e) => changeCountry(e.target.value)}
          placeholder={placeholder}
        >
          <option value="">Country</option>
          {countries.map(({ value, name }) => (
            <option value={value}>{name}</option>
          ))}
        </select>

      </div>
      <div>
        {documents && documents.map((docType) => (
          <label>
            <input
              type="radio"
              checked={docType === currDocumentType}
              onChange={() => changeDocumentType(docType)}
            />
            {getDocumentName(docType.name)}
          </label>
        ))}
      </div>

      <Footer
        next={actions.nextStep}
        back={actions.prevStep}
      />
    </>
  );
};

CountryAndDocument.propTypes = {
  countryDocuments: PropTypes.object,
};

CountryAndDocument.defaultProps = {
  countryDocuments: {},
};

CountryAndDocument.contextType = TranslationsContext;

export default CountryAndDocument;
