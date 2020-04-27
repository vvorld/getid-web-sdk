import { makeStyles } from '@material-ui/core';

const actionBarStyles = makeStyles((theme) => ({
  footerBlock: {
    display: 'flex',
    width: '100%',
    flexFlow: 'row wrap',
    height: '100%',
    lineHeight: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    [theme.breakpoints.down('sm')]: {
      marginTop: 50,
    },
  },
  right: {
    justifyContent: 'flex-end',
    display: 'flex',
    order: 4,
    [theme.breakpoints.down('xs')]: {
      marginTop: 20,
    },
  },
  center: {
    marginTop: 10,
    justifyContent: 'center',
    display: 'flex',
    order: 3,
    [theme.breakpoints.down('xs')]: {
      flexBasis: '100%',
      order: 1,
    },
  },
  left: {
    justifyContent: 'flex-start',
    order: 2,
    display: 'flex',
    marginTop: 10,
    [theme.breakpoints.down('xs')]: {
      marginTop: 20,
    },
  },
}));

export default actionBarStyles;
