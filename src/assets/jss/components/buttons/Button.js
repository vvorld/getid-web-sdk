import { fade, makeStyles } from '@material-ui/core';

const buttonStyles = makeStyles((theme) => ({
  footerBlock: {
    [theme.breakpoints.down('sm')]: {
      marginTop: 50,
    },
  },
  backButtonWrapper: {
    [theme.breakpoints.down('xs')]: {
      order: 2,
      marginTop: 10,
    },
  },
  nextButtonWrapper: {
    [theme.breakpoints.down('xs')]: {
      order: 1,
    },
  },
  root: {
    '& img': {
      verticalAlign: 'middle',
    },
    '& .MuiButton-endIcon': {
      marginLeft: '10px',
    },
    '& .MuiIconButton-root': {
      color: theme.palette.violet,
      '&:hover': {
        backgroundColor: 'transparent',
      },
    },
    '& span': {
      verticalAlign: 'middle',
      height: 'auto',
      width: 'auto',
      '& .material-icons': {
        display: 'flex',
        height: 'auto',
        width: 'auto',
      },
    },
    cursor: 'pointer',
    lineHeight: '16px',
    backgroundColor: theme.palette.white,
    border: `1px solid ${fade(theme.palette.blueShadow, 0.5)}`,
    borderRadius: '83px',
    boxShadow: `0 4px 14px ${fade(theme.palette.blue, 0.5)}, inset 0 1px 2px ${fade(theme.palette.white, 0.45)}`,
    boxSizing: 'border-box',
    color: theme.palette.blue,
    fontSize: '14px',
    fontWeight: 'bold',
    letterSpacing: '2px',
    textAlign: 'center',
    textTransform: 'uppercase',
    verticalAlign: 'middle',
    padding: '20px 40px',
    [theme.breakpoints.down('xs')]: {
      width: '100%',
    },
    '&:focus &:active': {
      outline: 'none',
    },
  },
  isGradient: {
    border: 0,
    color: theme.palette.white,
    background: `linear-gradient(9.89deg, ${theme.palette.aqua} -57.75%, ${theme.palette.crimson} 193.27%)`,
    '&:hover': {
      background: `linear-gradient(9.89deg, ${theme.palette.crimson} -57.75%, ${theme.palette.aqua} 193.27%)`,
    },
    '&:disabled': {
      color: theme.palette.white,
      opacity: 0.5,
      background: `linear-gradient(21.86deg, ${theme.palette.aqua} -57.75%, ${theme.palette.crimson} 193.27%)`,
      boxShadow: `0px 4px 14px ${theme.palette.blue}, inset 0px 1px 2px ${theme.palette.white}`,
      borderRadius: ' 83px',
      '&:hover': {
        background: `linear-gradient(21.86deg, ${theme.palette.crimson} -57.75%, ${theme.palette.aqua} 193.27%)`,
      },
    },
  },
  reset: {
    display: 'inline-block',
    margin: '10px',
  },
  prevButton: {
    border: 0,
    color: theme.palette.violet,
    background: 'transparent',
    boxShadow: 'none',
    borderColor: 'transparent',
    textAlign: 'left',
    '&:hover': {
      background: 'transparent',
    },
    '&.reset-left': {
      float: 'left',
    },
    '&.reset-right': {
      float: 'right',
    },
  },
  customButton: {
    background: theme.palette.white,
    color: theme.palette.blue,
    border: `1px solid ${theme.palette.white}`,
    fontSize: '12px',
    lineHeight: '14px',
    height: '33px',
    width: '121px',
    '&:hover': {
      background: 'lightgrey',
    },
  },
}));

export default buttonStyles;
