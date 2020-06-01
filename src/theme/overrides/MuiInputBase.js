import palette from '../palette';

export default {
  root: {
    '& fieldset': {
      borderRadius: '8px',
    },
    '&.MuiOutlinedInput-root': {
      '&.filled fieldset': {
        borderColor: palette.violet.main,
      },
      '&:hover fieldset': {
        borderColor: palette.violet.main,
      },
      '&$focused fieldset': {
        borderColor: palette.violet.main,
      },
      '&.selected fieldset': {
        borderColor: palette.violet.main,
      },
    },
    '&.MuiOutlinedInput-root:hover': {
      backgroundColor: 'transparent',
    },
    '&.MuiOutlinedInput-root&$focused': {
      backgroundColor: 'transparent',
    },
    '&$error': {
      borderColor: '#F0809B !important',
    },
  },
};
