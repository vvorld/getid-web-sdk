export const getFormValues = (store) => store.fields;
export const getScanValues = (store) => store.scans;
export const getIsDisabled = (store) => store.isDisabled;
export const getStep = (store) => store.step;
export const getCountryAndDocsValues = (store) => store.countriesAndDocs;
export const getFlow = (store) => store.sdkFlow;
export const getCurrentComponent = (store) => store.sdkFlow[store.step];
