const validateSortedDocs = (country, documentsToValidate, mainCounriesList) => {
  const supportedDocuments = mainCounriesList[country] && mainCounriesList[country].documents;
  if (!supportedDocuments) return [];

  return documentsToValidate.reduce((result, doc) => {
    if (typeof doc !== 'string' || !doc) return result;

    supportedDocuments.forEach((supDoc) => {
      if (doc.toLocaleLowerCase() === supDoc.name) result.push(supDoc);
    });

    return result;
  }, []);
};

const defaultSort = (country, documents) => {
  const idPassportDrivingCountries = ['at', 'be', 'bg', 'de', 'ee', 'fi', 'fr', 'gb', 'gr', 'hu', 'ie', 'is', 'it', 'lv', 'mt', 'no', 'pt', 'ro', 'se', 'si', 'cn'];
  const passportIdDrivingCountries = ['cy', 'li', 'lt', 'nl'];
  const idDrivingPassportCountries = ['cz', 'dk', 'es', 'hr', 'pl', 'sk'];
  const drivingPassportIdCountries = ['lu'];
  const drivingIdPassportCountries = ['au'];

  const idPassportDrivingDocuments = ['id-card', 'passport', 'driving-licence', 'residence-permit'];
  const passportIdDrivingDocuments = ['passport', 'id-card', 'driving-licence', 'residence-permit'];
  const idDrivingPassportDocuments = ['id-card', 'driving-licence', 'passport', 'residence-permit'];
  const drivingPassportIdDocuments = ['driving-licence', 'passport', 'id-card', 'residence-permit'];
  const drivingIdPassportDocuments = ['driving-licence', 'id-card', 'passport', 'residence-permit'];

  if (drivingPassportIdCountries.includes(country)) return drivingPassportIdDocuments;
  if (drivingIdPassportCountries.includes(country)) return drivingIdPassportDocuments;
  if (passportIdDrivingCountries.includes(country)) return passportIdDrivingDocuments;
  if (idDrivingPassportCountries.includes(country)) return idDrivingPassportDocuments;
  if (idPassportDrivingCountries.includes(country)) return idPassportDrivingDocuments;

  return documents;
};

export default (countriesAndDocs, sortFunction = defaultSort) => {
  const countriesList = Object.keys(countriesAndDocs);

  return countriesList.reduce((newCountriesList, country) => {
    const { name, documents } = countriesAndDocs[country];
    const documentNames = documents.map((d) => d.name);
    const sortedDocuments = sortFunction(country, documentNames);
    if (!Array.isArray(sortedDocuments)) return [];

    const validatedDocuments = validateSortedDocs(country, sortedDocuments, countriesAndDocs);

    if (validatedDocuments.length) {
      // eslint-disable-next-line no-param-reassign
      newCountriesList[country] = { name, documents: validatedDocuments };
    }

    return newCountriesList;
  }, {});
};
