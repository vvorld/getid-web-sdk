import React from 'react';
import { setCss } from '~/helpers/generic';
import { darkTheme } from '../../dark-theme';

import { Selfie, CaptureBack, CaptureFront } from './index';

export default { title: 'Layouts|Webcam' };

setCss(darkTheme);

export const SelfieView = () => (
  <main id="getid" data-role="container">
    <div className="getid-grid__main">
      <Selfie className="getid-button__wrapper" />
    </div>
  </main>
);

export const CaptureBackView = () => (
  <main id="getid" data-role="container">
    <div className="getid-grid__main">
      <CaptureBack className="getid-button__wrapper" />
    </div>
  </main>
);

export const CaptureFrontView = () => (
  <main id="getid" data-role="container">
    <div className="getid-grid__main">
      <CaptureFront className="getid-button__wrapper" />
    </div>
  </main>
);
