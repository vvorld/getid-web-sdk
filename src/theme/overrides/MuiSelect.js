import palette from '../palette';

export default {
  root: {
    '&.filled': {
      borderColor: palette.violet.main,
    },
    '&:hover': {
      borderColor: palette.violet.main,
    },
    '&& fieldset': {
      borderColor: palette.violet.main,
    },
    '&:focus': {
      borderColor: palette.violet.main,
    },
    '&.MuiSelect-outlined.MuiSelect-outlined': {
      backgroundColor: 'transparent',
      textAlign: 'left',
      lineHeight: '5px'
    },
  },
};
