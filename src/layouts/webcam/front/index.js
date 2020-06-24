import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import WebcamView from '../index';
import OverlaySVG from '../../../assets/icons/views/large-overlay.svg';
import OverlayFarSVG from '../../../assets/icons/views/large-overlay-far.svg';
import PassportSVG from '../../../assets/icons/views/passport-overlay.svg';
import { getFormValues } from '../../../store/selectors';

const IdCapture = (props) => {
  const { fieldValues, cameraDistance } = props;
  const isPassport = !!Object.values(fieldValues)
    .find(({ DocumentType }) => (DocumentType && DocumentType.value === 'passport'));

  const cameraOverlay = () => {
    if (isPassport) {
      return PassportSVG;
    }
    if (cameraDistance === 'far') {
      return OverlayFarSVG;
    }
    return OverlaySVG;
  };

  return (
    <WebcamView {...props} isPassport={isPassport} cameraOverlay={cameraOverlay} component="front" />
  );
};

const mapStateToProps = (state) => ({
  fieldValues: getFormValues(state),
});

IdCapture.propTypes = {
  fieldValues: PropTypes.object.isRequired,
  cameraDistance: PropTypes.string.isRequired,
};

export default connect(mapStateToProps)(IdCapture);
