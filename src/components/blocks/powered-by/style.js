import { makeStyles } from '@material-ui/core';

const poweredByStyles = makeStyles((theme) => ({
  block: {
    opacity: 0.3,
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center',
    margin: '30px auto 0',
  },
  text: {
    lineHeight: '22px',
    color: theme.palette.violet.main,
    fontSize: '13px',
    display: 'inline-block',
    verticalAlign: 'middle',
    textAlign: 'right',
    marginRight: '5px',
  },
  image: {
    verticalAlign: 'middle',
  },
}));

export default poweredByStyles;
