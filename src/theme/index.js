import { createMuiTheme } from '@material-ui/core/styles';
import palette from './palette';
import typography from './typography';
import overrides from './overrides';

const mainTheme = createMuiTheme({
  palette,
  typography,
  overrides,
  stepperShape: {
    width: 20,
    height: 20,
    borderRadius: '50%',
  },
});

export default mainTheme;
