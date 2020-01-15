import React from 'react';
import WebcamView from './WebcamView';
import OverlaySVG from '../../../assets/icons/views/large-overlay.svg';

const IdCaptureBack = (props) => {
  const cameraOverlay = () => OverlaySVG;

  return (
    <WebcamView {...props} cameraOverlay={cameraOverlay} component="back" />
  );
};

export default IdCaptureBack;
