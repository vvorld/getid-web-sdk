import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import loader from './style';

const Loader = (props) => {
  const classes = loader();
  const loaderText = 'Sending data...';
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
      <div className={classes.text}>{loaderText}</div>
    </div>
  );
};

export default Loader;
