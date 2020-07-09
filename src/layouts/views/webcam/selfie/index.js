import React from 'react';
import WebcamView from '../index';
import OverlaySVG from '../../../../assets/icons/views/circle-overlay.svg';
import mobileOverlay from '../../../../assets/icons/views/circle-overlay-mobile.svg';

const IdSelfie = (props) => {
  const cameraOverlay = () => OverlaySVG;
  const mobileCameraOverlay = () => mobileOverlay;

  return (
    <WebcamView {...props} mobileCameraOverlay={mobileCameraOverlay} cameraOverlay={cameraOverlay} component="selfie" />
  );
};

export default IdSelfie;
