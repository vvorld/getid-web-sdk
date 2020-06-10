const widgetStyles = (theme) => ({
  root: {
    padding: '40px 0 20px',
    fontFamily: theme.typography.fontFamily,
  },
  loader: {
    color: theme.palette.blueLoader,
  },
  item: {
    textAlign: 'center',
    position: 'relative',
  },
  center: {
    fontFamily: theme.typography.fontFamily,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    minHeight: '100vh',
  },
  verticalLine: {
    borderLeft: '1px solid rgba(120, 97, 162, 0.2)',
    position: 'relative',
    height: '100%',
    [theme.breakpoints.down('xs')]: {
      borderRight: 'none',
    },
  },
});

export default widgetStyles;
