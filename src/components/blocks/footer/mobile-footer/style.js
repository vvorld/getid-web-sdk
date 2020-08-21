import { makeStyles } from '@material-ui/core';

const FooterStyles = makeStyles(({ palette }) => ({
  button: {
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: '14px',
    lineHeight: '100%',
    textAlign: 'center',
    width: '100%',
    padding: '17px 18px',
    borderRadius: '34px',
    margin: '5px 0',
    letterSpacing: '1px',
  },
  actionsBlock: {
    display: 'flex',
    width: '100%',
    flexFlow: 'column wrap',
    lineHeight: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  retake: {
    order: 1,
    background: palette.violet.main,
    opacity: 0.7,
    color: palette.blueShadow,
  },
  next: {
    order: 2,
    color: palette.white,
  },
  back: {
    order: 3,
    color: palette.black,
    fontWeight: 'normal',
    textDecorationLine: 'underline',
    textTransform: 'none',
    opacity: 0.4,
  },
  hidden: {
    display: 'none',
  },
  darkMode: {
    color: palette.white,
    opacity: 1,
  },
  default: {
    marginTop: '30px',
  },
  poweredBy: {
    marginTop: '5px',
  },
}));

export default FooterStyles;
