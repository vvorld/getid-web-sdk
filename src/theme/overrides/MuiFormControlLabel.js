import palette from '../palette';

export default {
  label: {
    color: palette.blue.dark,
    textAlign: 'left',
    fontSize: '15px',
    fontStyle: 'normal',
    fontWeight: 'normal',
    '& label.checkbox': {
      fontSize: '13px',
    },
    '& a': {
      color: palette.violet.main,
    },
  },
};
