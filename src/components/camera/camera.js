import React, { useState } from 'react';
import PropTypes from 'prop-types';
import MobileCamera from '../mobile-camera/mobile-camera';

const Camera = (props) => {
  const [isStream, setStream] = useState(false);

  const {
    setWebcamRef,
    overlay,
    capture,
    isMobile,
  } = props;

  if (isMobile) {
    return (
      <MobileCamera
        capture={capture}
      />
    );
  }

  return (
    <div id="camera">
      <div>
        <video
          id="video-capture"
          width="100%"
          playsInline
          ref={setWebcamRef}
          muted
          autoPlay
          onPlaying={() => { setTimeout(() => { setStream(true); }, 500); }}
        >
          <track kind="captions" />
        </video>
        {isStream ? (
          <div>
            <img src={overlay()} alt="powered by getId" />
          </div>
        )
          : null}
      </div>
    </div>
  );
};

Camera.propTypes = {
  setWebcamRef: PropTypes.func.isRequired,
  overlay: PropTypes.func.isRequired,
  capture: PropTypes.func.isRequired,
  isMobile: PropTypes.bool.isRequired,
};

export default Camera;
