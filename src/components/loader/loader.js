import React from 'react';
import PropTypes from 'prop-types';

const Loader = (props) => {
  const { text } = props;
  return (
    <div>
      <div>
        Load
      </div>
      <div>{text}</div>
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
