import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStylesFacebook = makeStyles({
  root: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    display: 'flex',
  },
  top: {
    color: '#eef3fd',
  },
  bottom: {
    color: '#7861A2',
    animationDuration: '850ms',
    position: 'absolute',
    left: 0,
  },
  text: {
    position: 'absolute',
    top: '55%',
    left: 0,
    right: 0,
    margin: 'auto',
    textAlign: 'center',
    whiteSpace: 'nowrap',
    fontSize: '22px',
    lineHeight: '100%',
    color: '#194373',
  },
});

const Loader = (props) => {
  const classes = useStylesFacebook();
  return (
    <div>
      <div className={classes.root}>
        <CircularProgress
          variant="determinate"
          value={100}
          className={classes.top}
          size={42}
          thickness={4}
          {...props}
        />
        <CircularProgress
          variant="indeterminate"
          className={classes.bottom}
          size={42}
          value={25}
          thickness={4}
          {...props}
        />
      </div>
      <div className={classes.text}>Sending data...</div>
    </div>

  );
};

export default Loader;
