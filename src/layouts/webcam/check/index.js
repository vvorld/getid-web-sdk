import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import './check.css';

const Check = ({ showPreviewStep }) => {
  useEffect(() => {
    setTimeout(() => {
      showPreviewStep({ ok: true, message: 'photo is ok' });
    }, 1000);
  }, []);
  return (
    <div>
      Checking photo....
    </div>
  );
};

Check.propTypes = {
  showPreviewStep: PropTypes.func.isRequired,
};

export default Check;
