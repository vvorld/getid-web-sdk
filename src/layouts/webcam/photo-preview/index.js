import React from 'react';
import PropTypes from 'prop-types';

const PreviewForm = ({
  blob,
}) => {
  console.log(blob);
  const urlCreator = window.URL || window.webkitURL;

  const imageSrc = urlCreator.createObjectURL(blob);

  return (
    <div data-role="cameraPreview">
      <img
        style={{ width: '100%' }}
        src={imageSrc}
        alt="current"
        data-role="cameraPreviewImg"
      />
    </div>
  );
};

export default PreviewForm;
