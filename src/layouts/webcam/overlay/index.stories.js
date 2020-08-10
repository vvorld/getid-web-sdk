import React from 'react';
import createOverlay from './index';

export default { title: 'Webcam|Overlay' };

const Overlay = createOverlay('rectangle', 3 / 2);
const Ellips = createOverlay('ellips', 2 / 3);

export const Rectangle_480x240 = () => (
  <div style={{
    width: '480px', height: '240px', background: 'red', position: 'relative',
  }}
  >
    <Overlay width={480} height={240} />
  </div>
);

export const Rectangle_320x240 = () => (
  <div style={{
    width: '320px', height: '240px', background: 'red', position: 'relative',
  }}
  >
    <Overlay width={320} height={240} />
  </div>
);

export const Rectangle_240x320 = () => (
  <div style={{
    width: '240px', height: '320px', background: 'red', position: 'relative',
  }}
  >
    <Overlay width={240} height={320} />
  </div>
);

export const Rectangle_320x420 = () => (
  <div style={{
    width: '320px', height: '420px', background: 'red', position: 'relative',
  }}
  >
    <Overlay width={320} height={420} />
  </div>
);

export const Ellips_320x240 = () => (
  <div style={{
    width: '320px', height: '240px', background: 'red', position: 'relative',
  }}
  >
    <Ellips width={320} height={240} />
  </div>
);

export const Ellips_240x320 = () => (
  <div style={{
    width: '240px', height: '320px', background: 'red', position: 'relative',
  }}
  >
    <Ellips width={240} height={320} />
  </div>
);

export const Ellips_1x2 = () => (
  <div style={{
    width: '240px', height: '480px', background: 'red', position: 'relative',
  }}
  >
    <Ellips width={240} height={480} />
  </div>
);
