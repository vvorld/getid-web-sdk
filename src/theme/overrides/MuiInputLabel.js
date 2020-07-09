import palette from '../palette';

export default {
  outlined: {
    wordWrap: 'break-word',
    wordBreak: 'break-all',
    color: palette.blue.deep,
    '&.MuiInputLabel-outlined.MuiInputLabel-shrink': {
      backgroundColor: 'white',
      color: palette.violet.main,
    },
    '&$labelFocused': {
      backgroundColor: 'white',
      color: palette.violet.main,
    },
    '&.selected': {
      color: palette.violet.main,
    },
  },
};
