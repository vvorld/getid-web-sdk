import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import Loader from '../../../components/loader/loader';

const Check = ({
  onSuccess, onFail, onCheck, blob, enable,
}) => {
  if (!onCheck || !enable) {
    onSuccess();
    return null;
  }
  useEffect(() => {
    onCheck(blob)
      .then(({ result, message }) => {
        if (result) {
          onSuccess();
        } else {
          onFail({ message });
        }
      }).catch((e) => onFail(e));
  }, []);

  return (
    <div>
      <Loader />
    </div>
  );
};

Check.propTypes = {
  onSuccess: PropTypes.func,
  onFail: PropTypes.func,
  onCheck: PropTypes.func,
  blob: PropTypes.any,
  enable: PropTypes.bool,
};

Check.defaultProps = {
  onSuccess: null,
  onFail: null,
  onCheck: null,
  blob: null,
  enable: false,
};

export default Check;
