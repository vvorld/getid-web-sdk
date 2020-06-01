import { MuiInputBase, MuiSelect } from './overrides/index';

export default {
  MuiInputBase,
  MuiSelect,
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
