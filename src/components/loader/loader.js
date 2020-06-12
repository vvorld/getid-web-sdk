import React from 'react';
import PropTypes from 'prop-types';
import CircularProgress from '@material-ui/core/CircularProgress';
import loader from './style';

const Loader = (props) => {
  const classes = loader();
  const { text } = props;
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
      <div className={classes.text}>{text}</div>
    </div>
  );
};

Loader.propTypes = {
  text: PropTypes.string,
};

Loader.defaultProps = {
  text: '',
};

export default Loader;
