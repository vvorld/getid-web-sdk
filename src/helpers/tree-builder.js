const fileSize = (file) => {
  const stringLength = file.length - 'data:image/png;base64,'.length;

  const sizeInBytes = 4 * Math.ceil((stringLength / 3)) * 0.5624896334383812;
  return (sizeInBytes / 1000).toFixed(2);
};

export const buildFlow = (flow, components) => {
  if (!flow) return {};

  return flow.map((item, index) => ({
    component: components[item],
    name: item,
    order: index,
    next: {
      component: components[flow[index + 1]] || null,
      name: flow[index + 1],
    },
    previous: components[flow[index - 1]] || null,
  }));
};

export const mapScans = (scans) => Object.entries(scans).map((item) => ({
  name: item[0],
  size: fileSize(item[1]),
  format: 'base64',
  kind: item[0],
  mediaType: 'image/jpeg',
  blob: item[1],
}));

export const mapFieldData = (fields) => {
  const parsedFields = [];
  Object.keys(fields).forEach((item) => {
    if (!fields[item].Country || !fields[item].DocumentType) {
      Object.entries(fields[item]).map((listItem) => parsedFields.push({
        contentType: 'string',
        category: listItem[0],
        content: listItem[1],
      }));
    }
  });

  return parsedFields;
};

export const toBase64 = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = (error) => reject(error);
});

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

const documentImages = (state) => Object.keys(state.scans)
  .filter((key) => key !== 'selfie')
  .reduce((obj, key) => ({
    ...obj,
    [key]: state.scans[key],
  }), {});

const selfieImages = (state) => Object.keys(state.scans)
  .filter((key) => key === 'selfie')
  .reduce((obj, key) => ({
    ...obj,
    [key]: state.scans[key],
  }), {});

const getDocumentData = (fields, type) => {
  let stuff = '';
  Object.keys(fields).forEach((item) => {
    stuff = fields[item][type];
  });
  return stuff;
};

export const mapUserData = (state) => ({
  application: {
    fields: mapFieldData(state.fields),
    metadata: {
      metadata: 'web',
      submissionTime: new Date(),
    },
    documents: [
      {
        issuingCountry: getDocumentData(state.fields, 'Country'),
        documentType: getDocumentData(state.fields, 'DocumentType'),
        images: mapScans(documentImages(state)),
      },
    ],
    faces: [
      {
        category: 'selfie',
        content: mapScans(selfieImages(state)),
      },
    ],
  },
});
