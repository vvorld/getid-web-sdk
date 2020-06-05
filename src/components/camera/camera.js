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
  } = props;

  return (
    <div>
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
            {isStream ? (
              <div>
                <img className={classes.cameraOverlay} src={overlay()} alt="powered by getId" />
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
};

export default Camera;
