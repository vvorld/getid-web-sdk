import { createMuiTheme } from '@material-ui/core/styles';

const stepperTheme = createMuiTheme({
  palette: {
    primary: {
      light: '#ECE8F3',
      main: '#7861A2',
    },
  },
  shape: {
    width: 20,
    height: 20,
    borderRadius: '50%',
  },
});

export default stepperTheme;
