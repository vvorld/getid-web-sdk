/* eslint-disable jsx-a11y/media-has-caption */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

const PreviewForm = ({ load, onLoad, blob }) => {
  const urlCreator = window.URL || window.webkitURL;
  if (blob) {
    const src = blob && urlCreator.createObjectURL(blob);
    return (
      <div>
        <video
          controls
          className="getid-preview"
          src={src}
        />
      </div>
    );
  }
  if (!load) {
    return null;
  }
  useEffect(() => {
    (async () => {
      // eslint-disable-next-line no-constant-condition
      while (true) {
        // eslint-disable-next-line no-await-in-loop
        await new Promise((resolve) => setInterval(resolve, 1000));
        try {
          // eslint-disable-next-line no-await-in-loop
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
  return (
    <div>
      <video
        controls
        className="getid-preview"
      />
    </div>
  );
};

PreviewForm.propTypes = {
  blob: PropTypes.any,
  load: PropTypes.func,
  onLoad: PropTypes.func.isRequired,
};
PreviewForm.defaultProps = {
  blob: null,
  load: undefined,
};
export default PreviewForm;
