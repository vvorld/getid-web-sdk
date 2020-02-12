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
});

export default widgetStyles;
