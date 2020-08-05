import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './check.css';

const Check = ({
  onFinish, onCheck, onRetake, blob,
}) => {
  console.log('onCheck', onCheck);
  if (!onCheck) {
    onFinish();
    return null;
  }
  const [state, setState] = useState({
    message: 'Checking...',
    enableRetake: false,
  });
  useEffect(() => {
    onCheck(blob)
      .then(({ result, message }) => {
        if (result) {
          onFinish();
        } else {
          setState({ message, enableRetake: true });
        }
      }).catch((e) => onFinish());
  }, []);
  return (
    <div>
      {state.message}
      {state.enableRetake && (
        <div style={{ marginTop: '50px' }}>
          <button type="button" onClick={() => onRetake()} className="getid-button__main getid-violet">Retake</button>
        </div>

      )}
    </div>
  );
};

Check.propTypes = {
  showPreviewStep: PropTypes.func.isRequired,
};

export default Check;
