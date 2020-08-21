import { createMuiTheme } from '@material-ui/core/styles';
import palette from './palette';
import typography from './typography';
import overrides from './overrides';
import breakpoints from './breakpoints';

const mainTheme = (container) => createMuiTheme({
  props: {
    MuiPopover: {
      container,
    },
  },

  palette,
  typography,
  overrides,
  breakpoints,
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
