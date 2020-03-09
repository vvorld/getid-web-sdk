import {
  ADD_FIELD, SET_DISABLED, STORE_COUNTRIES_AND_DOCS, ADD_SCAN, SET_STEP, SET_FLOW,
  SET_ID_CAPTURE_BACK,
} from './actionTypes';

const addField = (key, value, whichStep, required, type) => ({
  type: ADD_FIELD,
  payload: {
    key, value, whichStep, required, type,
  },
});

const addScan = (key, value, whichStep, required) => ({
  type: ADD_SCAN,
  payload: {
    key, value, whichStep, required,
  },
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

const setIdCaptureBack = (index, step) => ({
  type: SET_ID_CAPTURE_BACK,
  payload: { index, step },
});

export default {
  addField, addCountriesAndDocs, addScan, setDisabled, setStep, setFlow, setIdCaptureBack,
};
