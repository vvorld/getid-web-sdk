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
      className="getid-camera__container"
      data-role="cameraPreview"
    >
      {checking && (
      <div className="getid-image__container">
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
  ratio: PropTypes.number,
  checking: PropTypes.bool,
};

PreviewForm.defaultProps = {
  blob: null,
  ratio: 0,
  checking: false,
};

export default PreviewForm;
