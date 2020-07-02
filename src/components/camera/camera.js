import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import cameraStyles from './style';
import Footer from '../blocks/footer/footer';
import PhotoSVG from '../../assets/icons/views/photo-camera.svg';
import TranslationsContext from '../../context/TranslationsContext';

const Camera = ({
  setWebcamRef,
  overlay,
  footer,
  capture,
  isCameraEnabled,
}) => {
  const [isStream, setStream] = useState(false);

  const classes = cameraStyles();
  const { translations } = useContext(TranslationsContext);
  const { next } = footer;

  const cameraFooter = {
    ...footer,
    next: {
      ...next,
      action: capture,
      text: translations.button_make_photo,
      iconItem: PhotoSVG,
      disabled: !isCameraEnabled,
    },
  };

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
        <Footer {...cameraFooter} />
      </Grid>
    </div>
  );
};

Camera.propTypes = {
  isCameraEnabled: PropTypes.bool.isRequired,
  footer: PropTypes.shape({
    next: PropTypes.shape({}).isRequired,
  }).isRequired,
  capture: PropTypes.func.isRequired,
  setWebcamRef: PropTypes.func.isRequired,
  overlay: PropTypes.func.isRequired,
};

export default Camera;
