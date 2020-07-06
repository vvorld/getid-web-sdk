import { makeStyles } from '@material-ui/core';

const MobileCameraStyles = makeStyles(() => ({
  cameraWrapper: {
    position: 'fixed',
    left: 0,
    bottom: 0,
    minHeight: '100vh',
    minWidth: '100vw',
    height: '100vh',
    width: '100vw',
  },
  video: {
    width: '100vw',
    minWidth: '100vw',
    minHeight: '100vh',
    objectFit: 'fill',
  },
  selfie: {
    transform: 'scale(-1, 1)',
  },
  footer: {
    position: 'fixed',
    bottom: 0,
    width: '100vw',
    padding: '10px 0',
    background: 'black',
  },
  overlay: {
    position: 'fixed',
    top: 0,
    display: 'block',
    width: '100vw',
  },
}));

export default MobileCameraStyles;
