import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Grid, Button } from '@material-ui/core';
import Icon from '@material-ui/core/Icon';
import TranslationsContext from '../../context/TranslationsContext';
import PhotoSVG from '../../assets/icons/views/photo-camera-purple.svg';
import buttonStyles from '../buttons/style';

const MobileCamera = ({
  capture,
}) => {
  const { translations } = useContext(TranslationsContext);
  const classes = buttonStyles();

  return (
    <div>
      <Grid container alignItems="center" justify="center">
        <Grid item xs={6} sm={10} md={9} alignItems="center" data-role="cameraLive">
          <Button
            classes={{
              root: classes.root,
            }}
            className={classes.makePhotoButton}
            endIcon={(
              <Icon>
                <img alt="icon" src={PhotoSVG} />
              </Icon>
)}
            component="label"
          >
            <input onChange={capture} hidden type="file" accept="image/*" capture="environment" />
            {translations.button_make_photo}
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

MobileCamera.propTypes = {
  capture: PropTypes.func.isRequired,
};

export default MobileCamera;
