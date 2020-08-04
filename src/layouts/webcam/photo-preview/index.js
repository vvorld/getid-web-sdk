import React from 'react';
import './preview.css';
import PropTypes from 'prop-types';

const PreviewForm = ({ blob, result }) => {
  const urlCreator = window.URL || window.webkitURL;
  if (!blob) {
    return null;
  }
  const imageSrc = urlCreator.createObjectURL(blob);
  return (
    <div data-role="cameraPreview">
      <div>{result.message}</div>
      <img
        className="getid-preview"
        src={imageSrc}
        alt="current"
        data-role="cameraPreviewImg"
      />
    </div>
  );
};

PreviewForm.propTypes = {
  blob: PropTypes.any.isRequired,
};

export default PreviewForm;
