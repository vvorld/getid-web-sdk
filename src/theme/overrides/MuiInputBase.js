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
      '&.MuiOutlinedInput-adornedEnd': {
        padding: 0,
      },
      '& .MuiOutlinedInput-notchedOutline': {
        border: '1px solid rgba(0, 0, 0, 0.6)',
      },
      '&.filled fieldset': {
        borderColor: 'rgba(0, 0, 0, 0.6)',
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
      color: 'rgba(0, 0, 0, 0.87)!important',
      '& .MuiInputAdornment-root.MuiInputAdornment-positionEnd': {
        color: 'pink',
        '& .MuiIconButton-label': {
          '& stroke, path': {
            fill: '#105EF6',
          },
        },
      },
      '& .MuiOutlinedInput-notchedOutline': {
        borderWidth: 1,
      },
    },
    '&$error': {
      borderColor: '#F0809B !important',
    },
  },
};
