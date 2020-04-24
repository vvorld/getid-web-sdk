import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import { Button } from '@material-ui/core';
import cameraStyles from '../../assets/jss/views/Camera';
import Footer from '../Footer';
import TranslationsContext from '../../context/TranslationsContext';

const MobileCamera = ({
  footer,
  capture,
}) => {
  const [isPhotoTaken, setIsPhotoTaken] = useState(false);
  const classes = cameraStyles();
  const { translations } = useContext(TranslationsContext);

  const captureStuff = (e) => {
    capture(e);
    setIsPhotoTaken(true);
  };

  const { next } = footer;

  const cameraFooter = {
    ...footer,
    next: {
      ...next,
      text: translations.button_next,
      disabled: !isPhotoTaken,
    },
    isPhotoTaken,
  };

  return (
    <div>
      <Grid container justify="center">
        <Grid item xs={12} sm={10} md={9} data-role="cameraLive">
          <Button variant="outlined" component="label" className={classes.stuff}>
            {translations.button_make_photo}
            <input onChange={captureStuff} hidden type="file" accept="image/*" capture="environment" />
          </Button>
        </Grid>
      </Grid>
      <Footer {...cameraFooter} />
    </div>
  );
};

MobileCamera.propTypes = {
  footer: PropTypes.shape({
    next: PropTypes.shape({}).isRequired,
  }).isRequired,
  capture: PropTypes.func.isRequired,
};

export default MobileCamera;
