import React from 'react';
import PropTypes from 'prop-types';
import CameraSteps from './camera-steps';
import Guide from './guide';
import Camera from './camera';
import overlay from './overlay';

import { isMobile } from '../../helpers/generic';
import RecordStep from './video-steps';
import LivenessStep from './liveness-steps';

const guide = (src) => () => <Guide src={src} />;

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
    Guide={guide(isMobile() ? 'https://cdn.getid.cloud/assets/mobile/default_front.svg' : 'https://cdn.getid.cloud/assets/desktop/default_front.svg')}
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
    Camera={camera('rectangle')}
    ratio={3 / 2}
    rules="PhotoRules"
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
    Camera={camera('ellips')}
    ratio={3 / 4}
    componentName="IdSelfie"
    rules="SelfieRules"
    isMobile={isMobile()}
    Guide={guide(isMobile() ? 'https://cdn.getid.cloud/assets/mobile/selfie.svg' : 'https://cdn.getid.cloud/assets/desktop/selfie.svg')}
    facingMode="user"
  />
);

const Liveness = (props) => (
  <LivenessStep
    {...props}
    componentName="Liveness"
    isMobile={isMobile()}
    // 'https://cdn.getid.cloud/assets/mobile/passport.svg',
    Guide={guide('https://cdn.getid.cloud/assets/desktop/recording.svg')}
    facingMode={{ exact: 'environment' }}
  />
);

const Record = (props) => (
  <RecordStep
    {...props}
    componentName="Video"
    isMobile={isMobile()}
    // 'https://cdn.getid.cloud/assets/mobile/passport.svg',
    Guide={guide('https://cdn.getid.cloud/assets/desktop/recording.svg')}
    facingMode={{ exact: 'environment' }}
  />
);

export {
  Selfie, CaptureBack, CaptureFront, DocumentPhoto, Record, Liveness,
};
