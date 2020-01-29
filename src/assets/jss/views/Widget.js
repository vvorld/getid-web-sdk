import { fade } from '@material-ui/core';

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
  hr: {
    background: fade(theme.palette.violet, 0.5),
    border: '0',
    height: '1px',
    margin: '20px auto',
    width: '100%',
    transform: 'rotate(90deg)',
    opacity: '0.2',
  },
});

export default widgetStyles;
