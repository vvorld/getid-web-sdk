import createBreakpoints from '@material-ui/core/styles/createBreakpoints';
import palette from '../palette';
import breakpoints from '../breakpoints';

const br = createBreakpoints(breakpoints);
export default {
  input: {
    padding: '17px 14px',
    height: '20px',
    [br.down('lg')]: {
      height: '22px',
    },
  },
  root: {
    '& fieldset': {
      borderRadius: '8px',
    },
    '&.MuiOutlinedInput-root': {
      '& .MuiOutlinedInput-input': {
        padding: '17px 14px',
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
