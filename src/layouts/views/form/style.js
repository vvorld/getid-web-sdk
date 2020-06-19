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
    margin: '0 30px 28px 0!important',
    position: 'relative',
    [theme.breakpoints.down('sm')]: {
      margin: '0 30px 22px 0!important',
    },
    [theme.breakpoints.down('xs')]: {
      margin: '0 0 22px 0!important',
    },
    '& p': {
      position: 'absolute',
      bottom: '-14px',
      height: '10px',
    },
    '& $helper': {
      position: 'absolute',
      height: '10px',
      top: '-25px',
    },
    '& $error': {
      position: 'absolute',
      bottom: '20px',
      [theme.breakpoints.down('sm')]: {
        bottom: '10px',
      },
    },
  },
  helper: {
    paddingBottom: '10px',
    color: theme.palette.gray.semiLight,
    opacity: '0.7',
  },
});
