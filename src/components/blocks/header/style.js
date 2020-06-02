import { makeStyles } from '@material-ui/styles';

const headerStyles = makeStyles((theme) => ({
  topPart: {
    marginTop: '75px',
    marginBottom: '50px',
    [theme.breakpoints.down('md')]: {
      marginTop: '75px',
    },
    [theme.breakpoints.down('sm')]: {
      marginTop: '30px',
    },
  },
}));

export default headerStyles;
