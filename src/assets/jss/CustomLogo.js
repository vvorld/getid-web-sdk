import { makeStyles } from '@material-ui/core';

const imgStyles = makeStyles((theme) => ({
  block: {
    alignItems: 'center',
    paddingBottom: '40px',
  },
  img: {
    verticalAlign: 'bottom',
    '&.getIdLogo': {
      [theme.breakpoints.down('sm')]: {
        width: '100px',
      },
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
