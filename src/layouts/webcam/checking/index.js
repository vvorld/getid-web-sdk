import React, { useEffect } from 'react';
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
      }).catch((e) => onSuccess());
  }, []);

  return (
    <div>
      <Loader />
    </div>
  );
};

export default Check;
