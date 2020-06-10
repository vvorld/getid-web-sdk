import { fade, makeStyles } from '@material-ui/core';

const FooterStyles = makeStyles((theme) => ({
  lineLong: {
    opacity: '0.3',
    width: '100%',
    margin: '40px auto 40px',
    border: 0,
    height: '1px',
    background: fade(theme.palette.violet.main, 0.5),
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
  text: {
    lineHeight: '22px',
    color: theme.palette.blue.main,
    opacity: 0.8,
    fontSize: '15px',
    display: 'inline-block',
    verticalAlign: 'middle',
    textAlign: 'right',
    marginRight: '37px',
  },
  spacebar: {
    margin: '50px auto',
  },
  image: {
    verticalAlign: 'middle',
  },
}));

export default FooterStyles;
