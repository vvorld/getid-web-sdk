import React from 'react';
import './preview.css';
import PropTypes from 'prop-types';
import Loader from '~/components/loader/loader';

const PreviewForm = ({ blob, ratio, checking }) => {
  const urlCreator = window.URL || window.webkitURL;
  if (!blob) {
    return null;
  }
  const imageSrc = urlCreator.createObjectURL(blob);

  const fwidth = 3 / 2 < ratio
    ? 100
    : (100 * (2 / 3)) * ratio;
  return (
    <div
      style={{ position: 'relative' }}
      data-role="cameraPreview"
    >
      {checking && (
      <div className="getid-image-container">
        <Loader />
      </div>
      )}
      <img
        className="getid-preview"
        src={imageSrc}
        style={{ maxWidth: `${fwidth}%` }}
        alt="current"
        data-role="cameraPreviewImg"
      />
    </div>
  );
};

PreviewForm.propTypes = {
  blob: PropTypes.any,
};

PreviewForm.defaultProps = {
  blob: null,
};

export default PreviewForm;
