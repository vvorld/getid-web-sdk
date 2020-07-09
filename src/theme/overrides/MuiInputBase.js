import palette from '../palette';

export default {
  input: {
    padding: '27px 14px',
    height: '0!important',
  },
  root: {
    '& fieldset': {
      borderRadius: '8px',
    },
    '&.MuiOutlinedInput-root': {
      '& .MuiOutlinedInput-input': {
        padding: '27px 14px',
      },
      '& .MuiOutlinedInput-notchedOutline': {
        border: `1px solid ${palette.gray.main}`,
      },
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
      '& .select-icon': {
        transform: 'rotateX(180deg)',
        display: 'flex',
        alignItems: 'center',
      },
      backgroundColor: 'transparent',
      '& .MuiOutlinedInput-notchedOutline': {
        borderWidth: 1,
      },
    },
    '&$error': {
      borderColor: '#F0809B !important',
    },
  },
};
