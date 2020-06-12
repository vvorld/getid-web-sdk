export const styles = (theme) => ({
  error: {
    color: theme.palette.error.main,
    fontSize: '12px',
    textAlign: 'left',
    margin: '8px 14px 0',
  },
  hidden: {
    display: 'none',
  },
  fieldWrapper: {
    padding: '8px 30px 30px 0!important',
    position: 'relative',
    [theme.breakpoints.down('sm')]: {
      padding: '8px 0px 20px 0!important',
    },
    '& p': {
      position: 'absolute',
      bottom: '-14px',
    },
    '& $helper': {
      position: 'absolute',
      top: '-20px',
    },
    '& $error': {
      position: 'absolute',
      bottom: '-6px',
    },
  },
  helper: {
    paddingBottom: '10px',
    color: theme.palette.gray.semiLight,
    opacity: '0.7',
  },
});
