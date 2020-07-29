import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import TranslationsContext from '../../../context/TranslationsContext';

const MobileCamera = ({
  capture,
}) => {
  const { translations } = useContext(TranslationsContext);

  return (
    <div>
      <button>
        <input onChange={capture} hidden type="file" accept="image/*" capture="environment" />
        {translations.button_make_photo}
      </button>
    </div>
  );
};

MobileCamera.propTypes = {
  capture: PropTypes.func.isRequired,
};

export default MobileCamera;
