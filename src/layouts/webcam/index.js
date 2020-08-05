import React from 'react';
import CameraSteps from './camera-steps';
import Guide from './guide';
import Camera from './camera';
import overlay from './overlay';

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
        // 'https://cdn.getid.cloud/assets/mobile/default_front.svg'
    Guide={guide('https://cdn.getid.cloud/assets/desktop/default_front.svg')}
  />
);

const CaptureBack = (props) => (
  <CameraSteps
    {...props}
    Camera={camera('rectangle', 3 / 2)}
    componentName="IdCaptureBack"
    onCheck={(blob) => props.api.checkSide(props.front, blob)
      .then((res) => {
        console.log('a', res, blob);
        if (res.documentType === 'unknown') {
          return { result: false, message: 'back side not found' };
        }
        return { result: true };
      })
      .catch(console.log)}
    // 'https://cdn.getid.cloud/assets/mobile/default_back.svg'
    Guide={guide('https://cdn.getid.cloud/assets/desktop/default_back.svg')}
  />
);
const Selfie = (props) => (
  <CameraSteps
    {...props}
    Camera={camera('ellips', 2 / 3)}
    componentName="IdSelfie"
            // 'https://cdn.getid.cloud/assets/mobile/selfie.svg',
    Guide={guide('https://cdn.getid.cloud/assets/desktop/selfie.svg')}
  />
);

const Passport = (props) => (
  <CameraSteps
    {...props}
    Camera={camera('rectangle', 1)}
    componentName="IdCapture"
    // 'https://cdn.getid.cloud/assets/mobile/passport.svg',
    Guide={guide('https://cdn.getid.cloud/assets/desktop/passport.svg')}
  />
);

const DocumentPhoto = (props) => (
  <CameraSteps
    {...props}
    Camera={camera('rectangle', 3 / 2)}
    finishStep={(delta) => {
      props.finishStep(delta);
    }}
    onCheck={props.checkDocumentPhoto}
    componentName="IdCapture"
        // 'https://cdn.getid.cloud/assets/mobile/default_front.svg'
    Guide={guide('https://cdn.getid.cloud/assets/desktop/default_front.svg')}
  />
);

export {
  Selfie, CaptureBack, CaptureFront, Passport, DocumentPhoto,
};
