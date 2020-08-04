import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

const Sending = ({ data, finishStep }) => {
  useEffect((x) => {
    setTimeout(() => {
      finishStep();
    }, 1000);
  }, data);
  return (
    <div>
      Send....
    </div>
  );
};

Sending.propTypes = {
  finishStep: PropTypes.func,
  onError: PropTypes.func,
  data: PropTypes.shape({}).isRequired,
};

Sending.defaultProps = {
  finishStep: null,
  onError: null,
};

export default Sending;
