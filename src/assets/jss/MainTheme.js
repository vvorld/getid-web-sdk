import { createMuiTheme } from '@material-ui/core/styles';

const mainTheme = createMuiTheme({
  palette: {
    black: '#000',
    white: '#fff',
    blue: '#173d69',
    blueDark: '#0e2846',
    blueShadow: '#1b3361',
    stepperLight: '#ece8f3',
    blueLight: '#eef3fd',
    aqua: '#00b1c9',
    crimson: '#ea167c',
    violet: '#7861a2',
    orange: '#ff5630',
    deepBlue: '#0e1c2c',
    lightViolet: '#F5F3FA',
    blueLoader: '#194373',
    background: {
      paper: 'white',
      default: 'white',
    },
  },
  stepperShape: {
    width: 20,
    height: 20,
    borderRadius: '50%',
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    mainHeaderSize: '26px',
  },
  overrides: {
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
  },
});

export default mainTheme;
