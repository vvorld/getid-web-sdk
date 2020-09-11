import React from 'react';
import PropTypes from 'prop-types';
import CameraSteps from './camera-steps';
import Guide from '~/components/guide';
import Camera from './camera';
import overlay from './overlay';

const guide = (name, styles) => () => <Guide name={name} styles={styles} />;

const camera = (figure) => (props) => (
  <Camera
    {...props}
    Overlay={overlay(figure)}
  />
);

const CaptureFront = (props) => (
  <CameraSteps
    {...props}
    Camera={camera('rectangle')}
    ratio={3 / 2}
    rules="PhotoRules"
    componentName="IdCapture"
    Guide={guide('defaultFrontDesktop', props.styles)}
    facingMode="environment"
  />
);

CaptureFront.propTypes = {
  styles: PropTypes.shape({}).isRequired,
};

const CaptureBack = (props) => (
  <CameraSteps
    {...props}
    Camera={camera('rectangle')}
    ratio={3 / 2}
    rules="PhotoRules"
    componentName="IdCaptureBack"
    onCheck={props.checkDocumentPhoto}
    Guide={guide('defaultBackDesktop', props.styles)}
    facingMode="environment"
  />
);

CaptureBack.propTypes = {
  checkDocumentPhoto: PropTypes.func.isRequired,
  styles: PropTypes.shape({}).isRequired,
};

const DocumentPhoto = (props) => (
  <CameraSteps
    {...props}
    Camera={camera('rectangle')}
    ratio={3 / 2}
    rules="PhotoRules"
    onCheck={props.checkDocumentPhoto}
    componentName="IdCapture"
    Guide={guide('defaultFrontDesktop', props.styles)}
    facingMode="environment"
  />
);
DocumentPhoto.propTypes = {
  checkDocumentPhoto: PropTypes.func.isRequired,
  styles: PropTypes.shape({}).isRequired,
};
const Selfie = (props) => (
  <CameraSteps
    {...props}
    Camera={camera('ellips')}
    ratio={3 / 4}
    componentName="IdSelfie"
    onCheck={props.checkSelfiePhoto}
    rules="SelfieRules"
    Guide={guide('selfieDesktop', props.styles)}
    facingMode="user"
  />
);
Selfie.propTypes = {
  checkSelfiePhoto: PropTypes.func.isRequired,
  styles: PropTypes.shape({}).isRequired,
};

export {
  Selfie, CaptureBack, CaptureFront, DocumentPhoto,
};
