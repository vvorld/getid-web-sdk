import React, { useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { Grid } from '@material-ui/core';
import cameraStyles from './style';
import Footer from '../blocks/footer';

const MobileCamera = ({
  overlay,
  setWebcamRef,
  footer,
  isSelfie
}) => {
  const classes = cameraStyles();
  const [isStream, setStream] = useState(false);

  return (
    <div>
      <div className={classes.cameraWrapper} id="camera">
        <Grid container justify="center">
          <Grid item xs={12} sm={10} md={9} data-role="cameraLive">
            <div>
              <video
                className={clsx(classes.video, isSelfie ? classes.selfie : '')}
                id="video-capture"
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
                  <img className={classes.overlay} src={overlay()} alt="powered by getId" />
                </div>
              )
                : null}
            </div>
            <div className={classes.footer}>
              <Footer {...footer()} />
            </div>
          </Grid>
        </Grid>
      </div>
    </div>

  );
};

MobileCamera.propTypes = {
  overlay: PropTypes.func.isRequired,
  footer: PropTypes.func.isRequired,
  setWebcamRef: PropTypes.func.isRequired,
};

export default MobileCamera;
