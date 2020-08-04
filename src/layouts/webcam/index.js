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

const placeholder = () => ({ children }) => (
  <div style={{ position: 'relative' }}>
    <div style={{
      position: 'absolute', top: 0, left: 0, width: '100%',
    }}
    >
      {children}
    </div>
    <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 342 196" />
  </div>
);
const CaptureFront = (props) => (
  <CameraSteps
    {...props}
    Camera={camera('rectangle', 3 / 2)}
    Placeholder={placeholder()}
    componentName="IdCapture"
        // 'https://cdn.getid.cloud/assets/mobile/default_front.svg'
    Guide={guide('https://cdn.getid.cloud/assets/desktop/default_front.svg')}
  />
);

const CaptureBack = (props) => (
  <CameraSteps
    {...props}
    Camera={camera('rectangle', 3 / 2)}
    Placeholder={placeholder()}
    componentName="IdCaptureBack"
    // 'https://cdn.getid.cloud/assets/mobile/default_back.svg'
    Guide={guide('https://cdn.getid.cloud/assets/desktop/default_back.svg')}
  />
);
const Selfie = (props) => (
  <CameraSteps
    {...props}
    Camera={camera('ellips', 2 / 3)}
    Placeholder={placeholder()}
    componentName="IdSelfie"
            // 'https://cdn.getid.cloud/assets/mobile/selfie.svg',
    Guide={guide('https://cdn.getid.cloud/assets/desktop/selfie.svg')}
  />
);

const Passport = (props) => (
  <CameraSteps
    {...props}
    Camera={camera('rectangle', 1)}
    Placeholder={placeholder()}
    componentName="IdCapture"
    // 'https://cdn.getid.cloud/assets/mobile/passport.svg',
    Guide={guide('https://cdn.getid.cloud/assets/desktop/passport.svg')}
  />
);

const DocumentPhoto = (props) => (
  <CameraSteps
    {...props}
    Camera={camera('rectangle', 3 / 2)}
    Placeholder={placeholder()}
    finishStep={(delta) => {
      props.setEnableBack(true);
      props.finishStep(delta);
    }}
    componentName="IdCapture"
        // 'https://cdn.getid.cloud/assets/mobile/default_front.svg'
    Guide={guide('https://cdn.getid.cloud/assets/desktop/default_front.svg')}
  />
);

export {
  Selfie, CaptureBack, CaptureFront, Passport, DocumentPhoto,
};
