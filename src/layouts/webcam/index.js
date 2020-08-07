import React from 'react';
import CameraSteps from './camera-steps';
import Guide from './guide';
import Camera from './camera';
import overlay from './overlay';
import { isMobile } from '../../helpers/generic';

const guide = (src) => () => <Guide src={src} />;

const camera = (figure, ratio) => (props) => (
  <Camera
    {...props}
    isMobile={isMobile()}
    Overlay={overlay(figure, ratio)}
  />
);

const CaptureFront = (props) => (
  <CameraSteps
    {...props}
    Camera={camera('rectangle', 3 / 2)}
    componentName="IdCapture"
        // 'https://cdn.getid.cloud/assets/mobile/default_front.svg'
    Guide={guide('https://cdn.getid.cloud/assets/desktop/default_front.svg')}
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
    // 'https://cdn.getid.cloud/assets/mobile/default_back.svg'
    Guide={guide('https://cdn.getid.cloud/assets/desktop/default_back.svg')}
    facingMode="environment"
  />
);

const DocumentPhoto = (props) => (
  <CameraSteps
    {...props}
    Camera={camera('rectangle', 3 / 2)}
    onCheck={props.checkDocumentPhoto}
    componentName="IdCapture"
    isMobile={isMobile()}

        // 'https://cdn.getid.cloud/assets/mobile/default_front.svg'
    Guide={guide('https://cdn.getid.cloud/assets/desktop/default_front.svg')}
    facingMode="environment"
  />
);
const Selfie = (props) => (
  <CameraSteps
    {...props}
    Camera={camera('ellips', 2 / 3)}
    componentName="IdSelfie"
    isMobile={isMobile()}

            // 'https://cdn.getid.cloud/assets/mobile/selfie.svg',
    Guide={guide('https://cdn.getid.cloud/assets/desktop/selfie.svg')}
    facingMode="user"
  />
);

const Passport = (props) => (
  <CameraSteps
    {...props}
    Camera={camera('rectangle', 1)}
    componentName="IdCapture"
    isMobile={isMobile()}

    // 'https://cdn.getid.cloud/assets/mobile/passport.svg',
    Guide={guide('https://cdn.getid.cloud/assets/desktop/passport.svg')}
    facingMode={{ exact: 'environment' }}
  />
);

export {
  Selfie, CaptureBack, CaptureFront, Passport, DocumentPhoto,
};
