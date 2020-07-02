import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import cameraStyles from './style';

const Camera = (props) => {
  const [isStream, setStream] = useState(false);

  const classes = cameraStyles();
  const {
    setWebcamRef,
    overlay,
    isMobile,
  } = props;

  return (
    <div
      style={isMobile && {
        position: 'fixed',
        right: 0,
        bottom: 0,
        minHeight: '100vh',
        margin: '0 auto',
        display: 'block',
        height: '100vh',
        width: '100vw',
      }}
      id="camera"
    >
      <Grid container justify="center">
        <Grid item xs={12} sm={10} md={9} data-role="cameraLive">
          <div className={classes.mediaWrapper}>
            <video
              style={isMobile && {
                minHeight: '100vh',
                display: 'block',
                height: '100vh',
                width: '100vw',
              }}
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
                  style={isMobile && {
                    position: 'fixed',
                    top: 0,
                    width: '100vw',
                  }}
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
    </div>
  );
};

Camera.propTypes = {
  setWebcamRef: PropTypes.func.isRequired,
  overlay: PropTypes.func.isRequired,
  isMobile: PropTypes.bool.isRequired,
};

export default Camera;
