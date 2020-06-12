import {
  ADD_FIELD, SET_BUTTON_AS_DISABLED, STORE_COUNTRIES_AND_DOCS, ADD_SCAN, SET_FLOW,
  SET_ID_CAPTURE_BACK, GO_TO_STEP,
} from './actionTypes';

const addField = (key, value, whichStep, required, type, hidden) => ({
  type: ADD_FIELD,
  payload: {
    key, value, whichStep, required, type, hidden,
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

const setButtonAsDisabled = () => ({
  type: SET_BUTTON_AS_DISABLED,
});

const goToStep = (where) => ({
  type: GO_TO_STEP,
  payload: { where },
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
  addField,
  addCountriesAndDocs,
  addScan,
  setButtonAsDisabled,
  setFlow,
  setIdCaptureBack,
  goToStep,
};
