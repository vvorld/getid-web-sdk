import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Loader from '../../components/loader/loader';

const Sending = ({ send, finishStep }) => {
  useEffect((x) => {
    send().then(
      finishStep(),
    );
  }, send);
  return (
    <Loader>
      Send....
    </Loader>
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
