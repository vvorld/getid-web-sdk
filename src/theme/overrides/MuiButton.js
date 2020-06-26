import createBreakpoints from '@material-ui/core/styles/createBreakpoints';
import palette from '../palette';
import breakpoints from '../breakpoints';

const br = createBreakpoints(breakpoints);

export default {
  root: {
    cursor: 'pointer',
    lineHeight: '17px',
    fontSize: '14px',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    verticalAlign: 'middle',
    textAlign: 'center',
    color: palette.blue.main,
    fontWeight: 'bold',
    border: 0,
    '&.hidden': {
      visibility: 'hidden',
    },
    '& img': {
      verticalAlign: 'middle',
    },
    [br.down('md')]: {
      width: '100%',
    },
    '&:focus &:active': {
      outline: 'none',
    },
  },
  contained: {
    boxShadow: '0px 5px 8px rgba(14, 51, 123, 0.15)',
    borderRadius: '83px',
    padding: '20px 100px',
    border: 0,
    color: palette.white,
    backgroundColor: palette.violet.main,
    '&:hover': {
      boxShadow: '0px 5px 8px rgba(14, 51, 123, 0.15)',
      backgroundColor: palette.violet.dark,
    },
    '&:disabled': {
      boxShadow: '0px 5px 8px rgba(14, 51, 123, 0.15)',
      color: palette.white,
      backgroundColor: palette.violet.main,
      opacity: 0.5,
    },
  },
  outlined: {
    border: 0,
    color: palette.violet.dark,
    background: 'transparent',
    boxShadow: 'none',
    borderColor: 'transparent',
    textAlign: 'left',
    lineHeight: 'normal',
    '&:hover': {
      background: 'transparent',
    },
  },
};
