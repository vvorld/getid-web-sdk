import { fade, makeStyles } from '@material-ui/core';

const FooterStyles = makeStyles((theme) => ({
  lineLong: {
    opacity: '0.3',
    width: '100%',
    margin: '0px auto 50px',
    border: 0,
    height: '1px',
    background: fade(theme.palette.violet, 0.5),
  },
  text: {
    lineHeight: '22px',
    color: theme.palette.blue,
    opacity: 0.8,
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
