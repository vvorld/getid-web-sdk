import React from 'react';
import css from './preview.css';

const PreviewForm = ({ blob }) => {
  const urlCreator = window.URL || window.webkitURL;
  if (!blob) {
    return null;
  }
  const imageSrc = urlCreator.createObjectURL(blob);
  return (
    <div data-role="cameraPreview">
      <img
        className={css.preview}
        src={imageSrc}
        alt="current"
        data-role="cameraPreviewImg"
      />
    </div>
  );
};

export default PreviewForm;
