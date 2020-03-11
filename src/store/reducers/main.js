import {
  ADD_FIELD, SET_DISABLED, STORE_COUNTRIES_AND_DOCS, ADD_SCAN, SET_STEP, SET_FLOW,
  SET_ID_CAPTURE_BACK,
} from '../actionTypes';

import {
  buildFlow,
} from '../../helpers/flow-builder';

const initialState = {
  fields: {},
  countriesAndDocs: {},
  scans: {},
  isDisabled: false,
  step: 0,
  sdkFlow: [],
  idCaptureBackIndex: -1,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case ADD_FIELD: {
      const {
        key, value, whichStep, required, type, hidden,
      } = action.payload;

      return {
        ...state,
        fields: {
          ...state.fields,
          [whichStep]: {
            ...state.fields[whichStep],
            [key]: {
              value,
              required,
              type,
              hidden,
            },
          },
        },
      };
    }

    case SET_DISABLED: {
      const { isDisabled } = action.payload;

      return {
        ...state,
        isDisabled,
      };
    }

    case SET_STEP: {
      const { step } = action.payload;

      return {
        ...state,
        step,
      };
    }

    case SET_FLOW: {
      const { flow } = action.payload;
      const sdkFlow = buildFlow(flow);

      return {
        ...state,
        sdkFlow,
      };
    }

    case SET_ID_CAPTURE_BACK: {
      const { index: idCaptureBackIndex } = action.payload;

      return {
        ...state,
        idCaptureBackIndex,
      };
    }

    case ADD_SCAN: {
      const {
        key, value, whichStep, required,
      } = action.payload;

      return {
        ...state,
        scans: {
          ...state.scans,
          [whichStep]: {
            ...state.scans[whichStep],
            [key]: {
              value,
              required,
            },
          },
        },
      };
    }

    case STORE_COUNTRIES_AND_DOCS: {
      const { countries } = action.payload;

      if (!state.countriesAndDocs.length || !state.countriesAndDocs) {
        return {
          ...state,
          countriesAndDocs: countries,
        };
      }

      return state.countriesAndDocs;
    }

    default:
      return state;
  }
}
