export const styles = (theme) => ({
  error: {
    color: theme.palette.error.main,
    fontSize: '12px',
    textAlign: 'left',
  },
  hidden: {
    display: 'none',
  },
  fieldWrapper: {
    padding: '0 30px 38px 0!important',
    position: 'relative',
    [theme.breakpoints.down('sm')]: {
      padding: '0 30px 28px 0!important',
    },
    '& p': {
      position: 'absolute',
      bottom: '-14px',
    },
    '& $helper': {
      position: 'absolute',
      top: '-25px',
    },
    '& $error': {
      position: 'absolute',
      bottom: '20px',
    },
  },
  helper: {
    paddingBottom: '10px',
    color: theme.palette.gray.semiLight,
    opacity: '0.7',
  },
});
