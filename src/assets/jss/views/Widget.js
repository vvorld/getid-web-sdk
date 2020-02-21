const widgetStyles = (theme) => ({
  root: {
    padding: '20px 0',
    fontFamily: theme.typography.fontFamily,
  },
  item: {
    textAlign: 'center',
    position: 'relative',
  },
  component: {
    marginBottom: '20px',
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
