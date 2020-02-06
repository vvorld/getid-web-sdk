import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import cameraStyles from '../../assets/jss/views/Camera';
import buttonStyles from '../../assets/jss/components/buttons/Button';
import SadSmileSVG from '../../assets/icons/views/sad-smile.svg';

const Camera = (props) => {
  const [isStream, setStream] = useState(false);

  const classes = cameraStyles();
  const buttonClass = buttonStyles();

  const cameraDisabled = (requestCamera) => (
    <Grid container direction="column" alignItems="center" className={classes.cameraDisabled}>
      <Grid item xs={10} sm={9} md={8} lg={7}>
        <img src={SadSmileSVG} alt="something wrong" />
        <div>To make a photo you need to give access for webcam</div>
        <Button
          classes={{
            root: buttonClass.root,
          }}
          className={buttonClass.customButton}
          onClick={requestCamera}
        >
try again
        </Button>
      </Grid>
    </Grid>
  );

  const {
    isCameraEnabled,
    setWebcamRef,
    requestCamera,
    overlay,
  } = props;

  return (
    isCameraEnabled
      ? (
        <div className={classes.mediaWrapper}>
          <video
            className={classes.video}
            width="100%"
            ref={setWebcamRef}
            autoPlay
            onPlaying={() => { setTimeout(() => { setStream(true); }, 500); }}
          >
            <track kind="captions" {...props} />
          </video>
          {isStream ? (
            <div>
              <img className={classes.cameraOverlay} src={overlay()} alt="powered by getId" />
              {/* <img className={classes.imgOverlay} src={PoweredBy} alt="powered by getId" /> */}
            </div>
          )
            : null}
        </div>
      )
      : (
        <div className={classes.mediaWrapper}>
          {cameraDisabled(requestCamera)}
        </div>
      )
  );
};

Camera.propTypes = {
  isCameraEnabled: PropTypes.bool.isRequired,
  setWebcamRef: PropTypes.func.isRequired,
  requestCamera: PropTypes.func.isRequired,
  overlay: PropTypes.func.isRequired,
};

export default Camera;
