import {
  ADD_FIELD, SET_BUTTON_AS_DISABLED, STORE_COUNTRIES_AND_DOCS, ADD_SCAN, SET_FLOW,
  SET_ID_CAPTURE_BACK, SET_SCAN_STEP_BUTTON_AS_DISABLED, GO_TO_STEP,
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

    case SET_BUTTON_AS_DISABLED: {
      const { fields, step } = state;

      if (fields[step]) {
        const fieldsToCheck = Object.values(fields[step])
          .filter((field) => field.required && !field.hidden);
        return {
          ...state,
          isDisabled: fieldsToCheck.some((field) => {
            const { value, type } = field;

            return (value === null
                || (type === 'date' && Number.isNaN(Date.parse(value)))
                || value === ''
                || value === undefined
                || value === false
                || (/^\s+$/).test(value.toString()));
          }),
        };
      }

      return {
        ...state,
        isDisabled: false,
      };
    }

    case SET_SCAN_STEP_BUTTON_AS_DISABLED: {
      const { scans, step } = state;

      if (scans[step]) {
        return {
          ...state,
          isDisabled: Object.values(scans[step]).some((scan) => (
            scan.required
              && (scan.value === null
              || scan.value === ''
              || scan.value === undefined
              || scan.value === false))),
        };
      }

      return {
        ...state,
        isDisabled: false,
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

    case GO_TO_STEP: {
      const { where } = action.payload;

      return {
        ...state,
        step: where,
      };
    }

    default:
      return state;
  }
}
