import { makeStyles } from '@material-ui/core';

const headerStyles = makeStyles((theme) => ({
  root: {
    marginBottom: '40px',
    [theme.breakpoints.down('sm')]: {
      marginBottom: '20px',
    },
  },
}));

export default headerStyles;
