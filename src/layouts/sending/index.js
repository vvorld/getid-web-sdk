import React, { useEffect, useState } from 'react';
import Loader from '~/components/loader/loader';
import { ErrorView } from '~/components/errors';

const Sending = ({ send, finishStep, prevStep }) => {
  const [count, setCount] = useState(0);
  const [{ sending, error }, setSendin] = useState({ sending: true });
  const sendData = () => {
    setSendin({ sending: true });
    setCount(count + 1);
    send()
      .then((result) => finishStep(result))
      .catch((e) => {
        console.error(e);
        setSendin({ sending: false, error: e.statusCode === 'customerid_exists' ? 'customerid_exists' : 'isFail' });
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
          <ErrorView
            error={error}
            callbacks={{
              onCancel: () => prevStep(),
              onRetry: () => sendData(),
            }}
          />
        )}
    </div>
  );
};

Sending.defaultProps = {
  send: null,
  data: {},
};

export default Sending;
