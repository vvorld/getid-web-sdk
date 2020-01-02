import {
  ADD_FIELD, SET_DISABLED, STORE_COUNTRIES_AND_DOCS, ADD_SCAN, SET_STEP, SET_FLOW,
} from './actionTypes';

const addField = (key, value, whichStep) => ({
  type: ADD_FIELD,
  payload: { key, value, whichStep },
});

const addScan = (key, value) => ({
  type: ADD_SCAN,
  payload: { key, value },
});

const addCountriesAndDocs = (countries) => ({
  type: STORE_COUNTRIES_AND_DOCS,
  payload: { countries },
});

const setDisabled = (isDisabled) => ({
  type: SET_DISABLED,
  payload: { isDisabled },
});

const setStep = (step) => ({
  type: SET_STEP,
  payload: { step },
});

const setFlow = (flow) => ({
  type: SET_FLOW,
  payload: { flow },
});


export default {
  addField, addCountriesAndDocs, addScan, setDisabled, setStep, setFlow,
};
