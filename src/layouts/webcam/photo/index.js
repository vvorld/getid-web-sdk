import React from 'react';
import PropTypes from 'prop-types';
import CameraSteps from './camera-steps';
import Guide from '~/components/guide';
import Camera from './camera';
import overlay from './overlay';

const guide = (src, styles) => () => <Guide src={src} styles={styles} />;

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
    Guide={guide('https://cdn.getid.cloud/assets/desktop/default_front.svg', props.styles)}
    facingMode="environment"
  />
);

const CaptureBack = (props) => (
  <CameraSteps
    {...props}
    Camera={camera('rectangle')}
    ratio={3 / 2}
    rules="PhotoRules"
    componentName="IdCaptureBack"
    onCheck={props.checkDocumentPhoto}
    Guide={guide('https://cdn.getid.cloud/assets/desktop/default_back.svg', props.styles)}
    facingMode="environment"
  />
);

CaptureBack.propTypes = {
  checkDocumentPhoto: PropTypes.func.isRequired,
};

const DocumentPhoto = (props) => (
  <CameraSteps
    {...props}
    Camera={camera('rectangle')}
    ratio={3 / 2}
    rules="PhotoRules"
    onCheck={props.checkDocumentPhoto}
    componentName="IdCapture"
    Guide={guide('https://cdn.getid.cloud/assets/desktop/default_front.svg', props.styles)}
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
    rules="SelfieRules"
    Guide={guide('https://cdn.getid.cloud/assets/desktop/selfie.svg', props.styles)}
    facingMode="user"
  />
);

export {
  Selfie, CaptureBack, CaptureFront, DocumentPhoto,
};
