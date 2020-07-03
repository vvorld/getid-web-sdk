import { makeStyles } from '@material-ui/core';

const MobileCameraStyles = makeStyles(() => ({
  cameraWrapper: {
    position: 'fixed',
    right: 0,
    bottom: 0,
    minHeight: '100vh',
    height: '100vh',
    width: '100vw',
  },
  video: {
    height: '100vh',
    width: '100vw',
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
