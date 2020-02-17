export const appendScansToForm = (form, scans) => {
  Object.keys(scans).forEach((step) => {
    Object.entries(scans[step]).forEach((scan) => {
      form.append(scan[0], scan[1]);
    });
  });

  return form;
};

export const mapFieldData = (fields, filter) => {
  const parsedFields = [];
  Object.keys(fields).forEach((item) => {
    Object.entries(fields[item]).forEach((listItem) => {
      if (!filter.includes(listItem[0])) {
        if (!filter.includes(listItem[1].type)) {
          parsedFields.push({
            contentType: 'string',
            category: listItem[0],
            content: listItem[1].value,
          });
        }
      }
    });
  });

  return parsedFields;
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

export const mapUserData = (state, jwtToken) => {
  let form = new FormData();
  form.append('data', JSON.stringify({
    userData: {
      application: {
        fields: mapFieldData(state.fields, ['Country', 'DocumentType', 'file']),
        metadata: {
          metadata: 'web',
          submissionTime: new Date(),
        },
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
    jwt: jwtToken,
  }));
  form = appendScansToForm(form, documentImages(state.scans));

  return form;
};
