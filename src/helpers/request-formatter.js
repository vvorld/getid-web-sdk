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

const documentImages = (scans) => Object.keys(scans)
  .map((step) => Object.keys(scans[step]).reduce((obj, key) => ({
    ...obj,
    [key]: scans[step][key].value,
  }), {}));

const getDocumentData = (fieldValues, name) => {
  const allFields = [].concat(...Object.values(fieldValues).map((x) => Object.entries(x)));
  const field = allFields.find(([n]) => n === name);
  if (!field) {
    return '';
  }
  const [, f] = field;
  return (f && f.value) || '';
};

export const createEAForSubmission = (state, jwt, verificationTypes, metadata) => {
  let form = new FormData();
  form.append('data', JSON.stringify({
    userData: {
      application: {
        fields: mapFieldData(state.fieldValues, ['Country', 'DocumentType', 'file']),
        metadata: {
          externalId: metadata && metadata.externalId,
          author: (metadata && metadata.author) || '',
          platform: 'web',
          userAgent: window.navigator.userAgent,
          clientVersion: version,
          locale: window.navigator.language,
          submissionTime: new Date(),
          verificationTypes,
        },
        documents: [
          {
            issuingCountry: getDocumentData(state.fieldValues, 'Country'),
            documentType: getDocumentData(state.fieldValues, 'DocumentType'),
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
