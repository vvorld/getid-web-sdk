import {
  MuiInputBase, MuiSelect, MuiInputLabel,
  MuiFormControlLabel,
  MuiCheckbox,
  MuiIconButton,
  MuiButton,
} from './overrides/index';

export default {
  MuiInputBase,
  MuiSelect,
  MuiInputLabel,
  MuiFormControlLabel,
  MuiCheckbox,
  MuiButton,
  MuiIconButton,
  MuiPickersToolbarText: {
    toolbarBtnSelected: {
      color: '#0e1c2c',
    },
    toolbarTxt: {
      color: '#0e1c2c',
    },
  },
  MuiPickersDatePickerRoot: {
    toolbar: {
      color: '#0e1c2c',
      backgroundColor: 'transparent',
    },
  },
  MuiPickersDay: {
    day: {
      '&:hover': {
        backgroundColor: '#F8F7FA',
        border: '1px solid #7861a2',
      },
    },
    daySelected: {
      backgroundColor: 'transparent',
      color: '#0e1c2c',
      '&:hover': {
        backgroundColor: '#F8F7FA',
        border: '1px solid #7861a2',
      },
    },
  },
};
