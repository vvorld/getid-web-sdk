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
      <div style={{ position: 'relative' }}>
        <video
          width="100%"
          playsInline
          ref={setWebcamRef}
          muted
          autoPlay
          onPlaying={() => { setTimeout(() => { setStream(true); }, 500); }}
        >
          <track kind="captions" />
        </video>

        <div style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          right: 0,
          left: 0,
          background: `url(${overlay()}) `,
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
        />
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
