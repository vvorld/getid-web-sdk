import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/styles';
import buttonStyles from '../../assets/jss/Button';
import SadSmileSVG from '../../assets/icons/views/sad-smile.svg';
import colors from '../../assets/jss/MainTheme';

const { palette } = colors;

const useStyles = makeStyles(() => ({
  cameraDisabled: {
    boxSizing: 'border-box',
    background: palette.blue,
    padding: '80px 0',
    '&& img': {
      marginBottom: '22px',
    },
    '&& div': {
      color: palette.white,
      fontSize: '15px',
      lineHeight: '22px',
      textAlign: 'center',
    },
    '&& button': {
      margin: '26px auto 12px',
    },
  },
  mediaWrapper: {
    position: 'relative',
    display: 'flex',
  },
  video: {
    transform: 'scaleX(-1)',
  },
  cameraOverlay: {
    width: '100%',
    left: 0,
    position: 'absolute',
    top: 0,
  },
  imgOverlay: {
    bottom: '10px',
    position: 'absolute',
    right: '10px',
  },
}));

const Camera = (props) => {
  const [isStream, setStream] = useState(
    false,
  );

  const classes = useStyles();

  const buttonClass = buttonStyles();

  const cameraDisabled = (requestCamera) => (
    <Grid container direction="column" alignItems="center" className={classes.cameraDisabled}>
      <Grid item xs={10} sm={9} md={8} lg={7}>
        <img src={SadSmileSVG} alt="something wrong" />
        <div>To make a photo you need to give access for webcam</div>
        <Button className={buttonClass.customButton} onClick={requestCamera}>try again</Button>
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
          />
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
