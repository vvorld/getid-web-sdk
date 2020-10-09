import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import TranslationsContext from '~/context/TranslationsContext';
import Footer from '~/components/blocks/footer';
import Radiobutton from '~/components/inputs/radio-button';
import '../form/form.css';
import Header from '~/components/blocks/header/header';
import Content from '~/components/blocks/content';
import Translate from '~/components/blocks/translations';

const mapCountryValues = (countriesAndDocs) => Object.entries(countriesAndDocs)
  .map(([value, { name, documents }]) => ({ name, value, documents }));

const iterArr = [1, 2, 3, 4];

const CountryAndDocument = ({
  countryDocuments, country, documentType, finishStep, prevStep,
}) => {
  const { translations } = useContext(TranslationsContext);
  const getDocuments = (c) => {
    const countryInfo = countryDocuments[c];
    return (countryInfo && countryInfo.documents) || [];
  };
  const countries = mapCountryValues(countryDocuments);
  const [currCountry, setValue] = useState(country);
  const [currDocumentType, setDocumentType] = useState(documentType);
  const changeCountry = (countryVal) => {
    setValue(countryVal);
    const documents = getDocuments(countryVal);
    if (documents.length) {
      setDocumentType(documents[0].name);
    }
  };
  const changeDocumentType = (dt) => {
    setDocumentType(dt);
  };

  const documents = getDocuments(currCountry);
  const plArr = iterArr.slice(getDocuments(currCountry).length);
  return (
    <>
      <Header step="CountryAndDocument" />
      <Content step="CountryAndDocument">
        <form className="getid-form__body" data-role="block-country-and-document">
          <div data-role="countries">
            <select
              value={currCountry}
              onChange={(e) => changeCountry(e.target.value)}
              placeholder={translations.CountryAndDocument_countryPlaceholder}
              className="getid-form__input-wrapper"
            >
              <option value="">Country</option>
              {countries.map(({ value, name }) => (
                <option key={name} value={value}>{name}</option>
              ))}
            </select>

          </div>
          <div data-role="documents">
            {documents && documents.map((docType) => (
              <div key={docType.name} className="getid-form__input-wrapper" data-role="input-wrapper">
                <Radiobutton
                  name={docType.name}
                  checked={docType.name === currDocumentType}
                  onChange={() => changeDocumentType(docType.name)}
                >
                  <Translate step="Const" element={docType.name} />
                </Radiobutton>
              </div>
            ))}
            {plArr.map((x) => (
              <div key={x} className="getid-form__input-wrapper getid-form__input-hidden" data-role="input-wrapper">
                <Radiobutton />
              </div>
            ))}
          </div>
        </form>
      </Content>
      <Footer
        step="CountryAndDocument"
        next={{
          onClick: () => finishStep({
            country: currCountry,
            documentType: currDocumentType,
          }),
          disable: !currDocumentType,
        }}
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
