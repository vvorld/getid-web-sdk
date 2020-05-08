export const styles = (theme) => ({
  hidden: {
    display: 'none',
  },
  fieldWrapper: {
    position: 'relative',
    marginBottom: '4px',
    '& p': {
      position: 'absolute',
      bottom: '-14px',
    },
    '& $helper': {
      position: 'initial',
    },
  },
  labelCheckbox: {
    margin: '40px 0 0 0',
    textAlign: 'left',
    '& label': {
      color: theme.palette.blueDark,
      lineHeight: '22px',
      fontStyle: 'normal',
      fontWeight: 'normal',
      fontSize: '15px',
    },
    '& a': {
      color: theme.palette.violet,
    },
  },
  helper: {
    margin: '0 8px 10px',
    color: theme.palette.blueDark,
    opacity: '0.7',
  },
});
