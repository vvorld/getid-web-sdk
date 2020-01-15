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
    MuiPickersToolbar: {
      toolbar: {
        backgroundColor: '#7861A2',
      },
    },
    'MuiPickersBasePicker-pickerView': {
      color: 'rgba(255, 255, 255, 0.54)',
    },
    MuiPickersYear: {
      root: {
        '&:focus': {
          color: '#7861A2',
        },
        color: '#7861A2',
      },
      yearSelected: {
        color: '#7861A2',
      },
    },
    MuiPickersMonth: {
      root: {
        '&:focus': {
          color: '#7861A2',
        },
        color: '#7861A2',
      },
      monthSelected: {
        color: '#7861A2',
      },
    },
    MuiPickersDay: {
      day: {
        '&:hover': {
          backgroundColor: '#7861A2!important',
          color: 'rgba(255, 255, 255, 0.54)!important',
        },
      },
      daySelected: {
        backgroundColor: '#7861A2',
        color: 'rgba(255, 255, 255, 0.54)!important',
        '&:hover': {
          backgroundColor: '#7861A2!important',
          color: 'rgba(255, 255, 255, 0.54)!important',
        },
      },
    },
  },
});

export default mainTheme;
