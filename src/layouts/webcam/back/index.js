import React from 'react';
import PropTypes from 'prop-types';
import WebcamView from '../index';
import OverlaySVG from '../../../assets/icons/views/large-overlay.svg';
import OverlayFarSVG from '../../../assets/icons/views/large-overlay-far.svg';

const IdCaptureBack = (props) => {
  const { cameraDistance } = props;
  const cameraOverlay = () => {
    if (cameraDistance === 'far') {
      return OverlayFarSVG;
    }
    return OverlaySVG;
  };

  return (
    <WebcamView {...props} cameraOverlay={cameraOverlay} component="back" />
  );
};

IdCaptureBack.propTypes = {
  cameraDistance: PropTypes.string.isRequired,
};

export default IdCaptureBack;
