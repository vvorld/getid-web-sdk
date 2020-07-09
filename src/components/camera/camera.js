import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import cameraStyles from './style';
import Footer from '../blocks/footer/desktop-footer/desktop-footer';
import MobileCamera from '../mobile-camera/mobile-camera';

const Camera = ({
  setWebcamRef,
  overlay,
  isSelfie,
  footer,
  isMobile,
}) => {
  const [isStream, setStream] = useState(false);
  const classes = cameraStyles();

  if (isMobile) {
    return (
      <MobileCamera
        footer={footer}
        isSelfie={isSelfie}
        setWebcamRef={setWebcamRef}
        overlay={overlay}
      />
    );
  }

  return (
    <div
      id="camera"
    >
      <Grid container justify="center">
        <Grid item xs={12} sm={10} md={9} data-role="cameraLive">
          <div className={classes.mediaWrapper}>
            <video
              id="video-capture"
              className={classes.video}
              width="100%"
              playsInline
              ref={setWebcamRef}
              muted
              autoPlay
              onPlaying={() => { setTimeout(() => { setStream(true); }, 500); }}
            >
              <track kind="captions" />
            </video>
            {(isStream && overlay) ? (
              <div>
                <img
                  className={classes.cameraOverlay}
                  src={overlay()}
                  alt="powered by getId"
                />
              </div>
            )
              : null}
          </div>
        </Grid>
      </Grid>
      <Footer {...footer()} />
    </div>
  );
};

Camera.defaultProps = {
  isSelfie: false,
};

Camera.propTypes = {
  footer: PropTypes.func.isRequired,
  setWebcamRef: PropTypes.func.isRequired,
  overlay: PropTypes.func.isRequired,
  isMobile: PropTypes.bool.isRequired,
  isSelfie: PropTypes.bool,
};

export default Camera;
