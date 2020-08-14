import React from 'react';
import PropTypes from 'prop-types';
import CameraSteps from './camera-steps';
import Guide from './guide';
import Camera from './camera';
import overlay from './overlay';

import { isMobile } from '../../helpers/generic';

const guide = (src) => () => <Guide src={src} />;

const camera = (figure, ratio) => (props) => (
  <Camera
    {...props}
    Overlay={overlay(figure, ratio)}
  />
);

const CaptureFront = (props) => (
  <CameraSteps
    {...props}
    Camera={camera('rectangle', 3 / 2)}
    componentName="IdCapture"
    Guide={guide(isMobile() ? 'https://cdn.getid.cloud/assets/mobile/default_front.svg' : 'https://cdn.getid.cloud/assets/desktop/default_front.svg')}
    facingMode="environment"
  />
);

const CaptureBack = (props) => (
  <CameraSteps
    {...props}
    Camera={camera('rectangle', 3 / 2)}
    componentName="IdCaptureBack"
    onCheck={props.checkDocumentPhoto}
    isMobile={isMobile()}
    Guide={guide(isMobile() ? 'https://cdn.getid.cloud/assets/mobile/default_back.svg' : 'https://cdn.getid.cloud/assets/desktop/default_back.svg')}
    facingMode="environment"
  />
);

CaptureBack.propTypes = {
  checkDocumentPhoto: PropTypes.func.isRequired,
};

const DocumentPhoto = (props) => (
  <CameraSteps
    {...props}
    Camera={camera('rectangle', 3 / 2)}
    onCheck={props.checkDocumentPhoto}
    componentName="IdCapture"
    isMobile={isMobile()}
    Guide={guide(isMobile() ? 'https://cdn.getid.cloud/assets/mobile/default_front.svg' : 'https://cdn.getid.cloud/assets/desktop/default_front.svg')}
    facingMode="environment"
  />
);
DocumentPhoto.propTypes = {
  checkDocumentPhoto: PropTypes.func.isRequired,
};
const Selfie = (props) => (
  <CameraSteps
    {...props}
    Camera={camera('ellips', 2 / 3)}
    componentName="IdSelfie"
    isMobile={isMobile()}
    Guide={guide(isMobile() ? 'https://cdn.getid.cloud/assets/mobile/selfie.svg' : 'https://cdn.getid.cloud/assets/desktop/selfie.svg')}
    facingMode="user"
  />
);

const Passport = (props) => (
  <CameraSteps
    {...props}
    Camera={camera('rectangle', 1)}
    componentName="IdCapture"
    isMobile={isMobile()}
    Guide={guide(isMobile() ? 'https://cdn.getid.cloud/assets/mobile/passport.svg' : 'https://cdn.getid.cloud/assets/desktop/passport.svg')}
    facingMode={{ exact: 'environment' }}
  />
);

const Video = (props) => (
  <CameraSteps
    {...props}
    Camera={camera('none', 1)}
    componentName="Video"
    isMobile={isMobile()}
    Guide={guide(isMobile() ? 'https://cdn.getid.cloud/assets/mobile/passport.svg' : 'https://cdn.getid.cloud/assets/desktop/passport.svg')}
    facingMode={{ exact: 'environment' }}
  />
);

export {
  Selfie, CaptureBack, CaptureFront, Passport, DocumentPhoto, Video,
};
