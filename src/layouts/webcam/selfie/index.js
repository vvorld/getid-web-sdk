import React from 'react';
import WebcamView from '../index';
import OverlaySVG from '../../../assets/icons/views/circle-overlay.svg';

const IdSelfie = (props) => {
  const cameraOverlay = () => OverlaySVG;

  return (
    <WebcamView {...props} cameraOverlay={cameraOverlay} component="selfie" />
  );
};

export default IdSelfie;
