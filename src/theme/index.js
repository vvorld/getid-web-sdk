import { createMuiTheme } from '@material-ui/core/styles';
import palette from './palette';
import typography from './typography';
import overrides from './overrides';
import breakpoints from './breakpoints';

const mainTheme = (container) => createMuiTheme({
  palette,
  typography,
  overrides,
  breakpoints,
  container,
  stepperShape: {
    width: 20,
    height: 20,
    borderRadius: '50%',
  },
  inputBorder: {
    borderRadius: '8px',
    border: `1px solid ${palette.gray.main}`,
    '&.selectedVal': {
      opacity: '1!important',
      borderColor: palette.violet.main,
      color: palette.blue.deep,
    },
    '&.filled': {
      borderColor: palette.violet.main,
    },
    '&:hover': {
      borderColor: palette.violet.main,
    },
    '&$focused': {
      borderColor: palette.violet.main,
    },
    '&.selected': {
      borderColor: palette.violet.main,
    },
  },
});

export default mainTheme;
