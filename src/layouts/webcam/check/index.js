import React, { useEffect, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import Loader from '../../../components/loader/loader';
import { RulesList } from '../../rules';
import TranslationsContext from '../../../context/TranslationsContext';

const Check = ({
  onFinish, onCheck, onRetake, blob, enable,
}) => {
  if (!onCheck || !enable) {
    onFinish();
    return null;
  }
  const [state, setState] = useState({
    message: 'Checking...',
    enableRetake: false,
    isLoading: true,
  });
  useEffect(() => {
    onCheck(blob)
      .then(({ result, message }) => {
        if (result) {
          onFinish();
        } else {
          setState({ message, enableRetake: true, isLoading: false });
        }
      }).catch((e) => onFinish());
  }, []);
  const { translations } = useContext(TranslationsContext);

  return (
    <div>
      <Loader />
      <RulesList translations={translations} />
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
