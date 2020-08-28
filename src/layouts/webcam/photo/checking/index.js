import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import Loader from '~/components/loader/loader';

const Check = ({
  onSuccess, onFail, onCheck, blob, enable, tryNumber,
}) => {
  if (!onCheck || !enable) {
    onSuccess();
    return null;
  }
  useEffect(() => {
    onCheck(blob, tryNumber)
      .then(({ result, code }) => {
        if (result) {
          onSuccess();
        } else {
          onFail({ code });
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
  tryNumber: PropTypes.number.isRequired,
};

Check.defaultProps = {
  onSuccess: null,
  onFail: null,
  onCheck: null,
  blob: null,
  enable: false,
};

export default Check;
