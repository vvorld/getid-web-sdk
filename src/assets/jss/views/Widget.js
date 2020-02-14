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
  verticalLine: {
    borderRight: '1px solid rgba(120, 97, 162, 0.2)',
    position: 'relative',
    marginTop: '10px',
    [theme.breakpoints.down('xs')]: {
      borderRight: 'none',
    },
  },
});

export default widgetStyles;
