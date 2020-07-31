import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import frameRenderer from './helpers';

const MobileCamera = (props) => {
  const [localWidth, setWidth] = useState(0);
  const [localHeight, setHeight] = useState(0);
  const { Overlay } = props;
  const videoRef = useRef();

  useEffect( () => {
    const setSrc = async (ref) => {
      const refLocal = ref;
      if (!refLocal) {
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: { deviceId: true, width: 4096 },
        });
        const { width, height } = stream.getVideoTracks()[0].getSettings();
        setWidth(width);
        setHeight(height);
        refLocal.srcObject = stream;
        const intervalId = setInterval(() => {
          if (ref.readyState === 4) {
            clearInterval(intervalId);
            props.onReady(frameRenderer(ref, width, height));
          }
        }, 100);
      } catch (err) {
        props.onError(err);
      }
    };
    setSrc(videoRef.current);
  }, []);

  return (
    <div style={{ position: 'relative', transform: 'scale(-1, 1)' }}>
      <video
        width="100%"
        playsInline
        ref={videoRef}
        muted
        autoPlay
      >
        <track kind="captions" />
      </video>
      {Overlay && <Overlay width={localWidth} height={localHeight} />}
    </div>
  );
};

MobileCamera.propTypes = {
  Overlay: PropTypes.any.isRequired,
  onError: PropTypes.func.isRequired,
  onReady: PropTypes.func.isRequired,
};

export default MobileCamera;
