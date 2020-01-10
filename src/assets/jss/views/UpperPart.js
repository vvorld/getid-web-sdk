import { makeStyles } from '@material-ui/styles';
import { fade } from '@material-ui/core';

const headerStyles = makeStyles((theme) => ({
  topPart: {
    marginTop: '75px',
    [theme.breakpoints.down('md')]: {
      marginTop: '75px',
    },
    [theme.breakpoints.down('sm')]: {
      marginTop: '30px',
    },
  },
  header: {
    marginTop: 1,
    color: theme.palette.blue,
    fontSize: theme.typography.mainHeaderSize,
    letterSpacing: '0.192941px',
    lineHeight: '41px',
  },
  subHeader: {
    margin: '0 8px 30px 8px',
    fontSize: '15px',
    fontStyle: 'normal',
    fontWeight: 'normal',
    lineHeight: '22px',
    color: theme.palette.blueDark,
    opacity: '0.7',
    [theme.breakpoints.down('sm')]: {
      marginTop: '13px',
    },
  },
  hr: {
    background: fade(theme.palette.violet, 0.5),
    border: '0',
    height: '1px',
    margin: '0 auto 20px',
    width: '30px',
  },
}));

export default headerStyles;
