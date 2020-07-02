import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Grid } from '@material-ui/core';
import buttonStyles from '../buttons/style';

const MobileCamera = ({
  overlay,
  setWebcamRef,
}) => {
  const classes = buttonStyles();
  const [isStream, setStream] = useState(false);

  return (
    <div
      id="camera"
    >
      <Grid container justify="center">
        <Grid item xs={12} sm={10} md={9} data-role="cameraLive">
          <div className={classes.mediaWrapper}>
            <video
              style={{
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
                  style={{
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

MobileCamera.propTypes = {
  overlay: PropTypes.func.isRequired,
};

export default MobileCamera;
