import { makeStyles } from '@material-ui/core';

const actionBarStyles = makeStyles((theme) => ({
  footerBlock: {
    display: 'flex',
    width: '100%',
    flexFlow: 'row wrap',
    lineHeight: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    [theme.breakpoints.down('sm')]: {
      marginTop: '30px',
    },
  },
  right: {
    justifyContent: 'flex-end',
    order: 4,
    [theme.breakpoints.down('xs')]: {
      marginTop: '15px',
    },
  },
  center: {
    margin: 'auto',
    order: 3,
    [theme.breakpoints.down('xs')]: {
      flexBasis: '100%',
      order: 1,
    },
  },
  left: {
    justifyContent: 'flex-start',
    order: 2,
    [theme.breakpoints.down('xs')]: {
      marginTop: '15px',
    },
  },
}));

export default actionBarStyles;
