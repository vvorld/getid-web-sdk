import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Loader from '~/components/loader/loader';

const Sending = ({ send, finishStep }) => {
  useEffect(() => {
    send().then((result) => finishStep(result));
  }, send);
  return (
    <div style={{ marginTop: '50px' }}>
      <Loader>
        Send....
      </Loader>
    </div>
  );
};

Sending.propTypes = {
  finishStep: PropTypes.func,
  send: PropTypes.func,
  data: PropTypes.shape({}).isRequired,
};

Sending.defaultProps = {
  finishStep: null,
  send: null,
};

export default Sending;
