import { makeStyles } from '@material-ui/core';

const imgStyles = makeStyles((theme) => ({
  block: {
    alignItems: 'center',
    marginBottom: '35px',
  },
  img: {
    verticalAlign: 'bottom',
    '&.getIdLogo': {
      width: '108px',
      height: '41px',
    },
  },
  text: {
    opacity: 0.3,
    paddingRight: 8,
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: '15px',
    lineHeight: '22px',
    color: theme.palette.blue,
  },
}));

export default imgStyles;
