import store from '../store/store';
import { version } from '../../package.json';

export const appendScansToForm = (form, scans) => {
  Object.keys(scans).forEach((step) => {
    Object.entries(scans[step]).forEach((scan) => {
      form.append(scan[0], scan[1]);
    });
  });

  return form;
};

const typeMap = {
  text: 'string',
  date: 'date',
  checkbox: 'boolean',
  select: 'string',
};

export const mapFieldData = (fields, filter) => {
  const allFields = Object.values(fields).map(
    (fieldList) => Object.entries(fieldList)
      .filter(([name, properties]) => !(filter.includes(name) || filter.includes(properties.type)))
      .map(([name, properties]) => ({
        contentType: typeMap[properties.type] || 'string',
        category: name,
        content: properties.value,
      })),
  );

  return Array.prototype.concat(...allFields);
};


export const mapCountryValues = (countriesAndDocs) => {
  const countries = [];
  Object.keys(countriesAndDocs).forEach((key) => {
    countries.push({
      name: countriesAndDocs[key].name,
      value: key,
      documents: countriesAndDocs[key].documents,
    });
  });
  return countries;
};

const documentImages = (scans) => Object.keys(scans)
  .map((step) => Object.keys(scans[step]).reduce((obj, key) => ({
    ...obj,
    [key]: scans[step][key].value,
  }), {}));


const getDocumentData = (fields, fieldName) => {
  let docData = '';

  Object.keys(fields).forEach((step) => {
    if (fields[step][fieldName]) {
      docData = fields[step][fieldName].value;
    }
  });

  return docData;
};

const mapFileNames = (fields) => Object.values(fields)
  .map((data) => Object.entries(data)
    .filter(([, val]) => val.type === 'file')
    .map(([name]) => name));

export const createEAForSubmission = (jwt, verificationTypes) => {
  const state = store.getState();
  let form = new FormData();
  form.append('data', JSON.stringify({
    userData: {
      application: {
        fields: mapFieldData(state.fields, ['Country', 'DocumentType', 'file']),
        metadata: {
          metadata: 'web',
          sdkVersion: version,
          locale: window.navigator.language,
          submissionTime: new Date(),
          verificationTypes,
        },
        files: mapFileNames(state.fields),
        documents: [
          {
            issuingCountry: getDocumentData(state.fields, 'Country'),
            documentType: getDocumentData(state.fields, 'DocumentType'),
            images: [],
          },
        ],
        faces: [
          {
            category: 'selfie',
            content: [],
          },
        ],
      },
    },
    jwt,
  }));
  form = appendScansToForm(form, documentImages(state.scans));

  return form;
};
