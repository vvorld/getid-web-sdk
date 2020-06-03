import palette from './palette';

export default {
  fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  mainHeaderSize: '26px',
  h1: {
    color: palette.blue.main,
    fontSize: '26px',
    letterSpacing: '0.192941px',
    lineHeight: '41px',
    marginTop: 1,
    marginBlockEnd: '10px',
    fontWeight: 'bold',
  },
  h2: {
    fontSize: '15px',
    fontStyle: 'normal',
    fontWeight: 'normal',
    lineHeight: '22px',
    color: palette.blue.dark,
    opacity: '0.7',
    marginTop: 0,
    marginBottom: 10,
  },
  main: {
    fontSize: '16px',
    lineHeight: '16px',
    color: palette.blue.deep,
    backgroundColor: palette.white,
    textAlign: 'left',
  },
  mainInput: {
    overflow: 'hidden',
    width: '100%',
    fontSize: '16px',
    lineHeight: '16px',
    color: palette.blue.deep,
    backgroundColor: palette.white,
    textAlign: 'left',
  },
  label: {
    wordWrap: 'break-word',
    wordBreak: 'break-all',
    color: palette.blue.deep,
    '&.MuiInputLabel-outlined.MuiInputLabel-shrink': {
      backgroundColor: 'white',
      color: palette.violet.main,
    },
    '&$labelFocused': {
      backgroundColor: 'white',
      color: palette.violet.main,
    },
    '&.selected': {
      color: palette.violet.main,
    },
  },
};
