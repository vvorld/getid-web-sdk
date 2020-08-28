import React, { useEffect } from 'react';
import './preview.css';
import PropTypes from 'prop-types';

const PreviewForm = ({ load, onLoad, blob }) => {
  const urlCreator = window.URL || window.webkitURL;
  if (!load) {
    return null;
  }
  useEffect(() => {
    (async () => {
      while (true) {
        await new Promise((resolve) => setInterval(resolve, 100));
        try {
          const video = await load();
          if (video && video.size) {
            onLoad(video);
            return;
          }
        } catch (e) {
          console.log(e);
        }
      }
    })();
  }, [load]);
  const src = blob && urlCreator.createObjectURL(blob);
  return (
    <div data-role="cameraPreview">
      <video
        controls
        className="getid-preview"
        src={src}
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