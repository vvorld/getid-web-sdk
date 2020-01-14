import bs58 from 'bs58';
import crypto from 'crypto';

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
  images: [{
    blob: item[1],
  }],
}));

export const mapFieldData = (fields) => {
  const parsedFields = [];
  Object.keys(fields).forEach((item) => {
    Object.entries(fields[item]).map((listItem) => parsedFields.push({
      contentType: 'string',
      category: listItem[0],
      content: listItem[1],
    }));
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

export const getDonorToken = () => bs58.encode(crypto.createHash('sha256').update(Date.now().toString()).digest());
