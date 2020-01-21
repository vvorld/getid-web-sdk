const consentStyles = (theme) => ({
  poweredBlock: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '30px',
    marginBottom: '30px',
    '&& img': {
      margin: '0 11px',
    },
  },
  poweredLabel: {
    fontSize: '15px',
    lineHeight: '22px',
    color: theme.palette.blue,
    opacity: 0.3,
  },
  slash: {
    opacity: 0.1,
    width: '1px',
    margin: '0 3px',
    background: theme.palette.black,
  },
  labelCheckbox: {
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
});

export default consentStyles;
