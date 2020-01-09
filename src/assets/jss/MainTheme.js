import { createMuiTheme } from '@material-ui/core/styles';

const mainTheme = createMuiTheme({
  palette: {
    black: '#000',
    white: '#fff',
    blue: '#173d69',
    blueDark: '#0e2846',
    blueShadow: '#1b3361',
    stepperLight: '#ECE8F3',
    aqua: '#00b1c9',
    crimson: '#ea167c',
    violet: '#7861a2',
    orange: '#ff5630',
    deepBlue: '#0e1c2c',
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
});

export default mainTheme;
