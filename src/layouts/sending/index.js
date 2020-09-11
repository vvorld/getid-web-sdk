import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Loader from '~/components/loader/loader';
import { FailError } from '~/components/errors';

const Sending = ({ send, finishStep, prevStep }) => {
  const [count, setCount] = useState(0);
  const [sending, setSendin] = useState(true);
  const sendData = () => {
    setSendin(true);
    setCount(count + 1);
    send()
      .then((result) => finishStep(result))
      .catch((e) => {
        console.error(e);
        setSendin(false);
      });
  };
  useEffect(() => sendData(), send);
  return (
    <div style={{ marginTop: '50px' }}>
      {sending
        ? (
          <Loader>
            Send....
          </Loader>
        )
        : (
          <FailError callbacks={{
            onFail: () => prevStep(),
            onSubmit: () => sendData(),
          }}
          />
        )}
    </div>
  );
};

Sending.propTypes = {
  finishStep: PropTypes.func.isRequired,
  prevStep: PropTypes.func.isRequired,
  send: PropTypes.func,
  data: PropTypes.shape({}).isRequired,
};

Sending.defaultProps = {
  send: null,
};

export default Sending;
