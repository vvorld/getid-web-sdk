import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import Footer from '../Footer';
import TranslationsContext from '../../context/TranslationsContext';
import CustomButton from '../CustomButton';
import PhotoSVG from '../../assets/icons/views/photo-camera-purple.svg';

const MobileCamera = ({
  footer,
  capture,
  isPhotoTaken,
}) => {
  const { translations } = useContext(TranslationsContext);

  const { next } = footer;

  const cameraFooter = {
    ...footer,
    next: {
      ...next,
      disabled: !isPhotoTaken,
    },
  };

  const makePhotoButton = {
    direction: 'center',
    width: 6,
    text: translations.button_make_photo,
    className: 'makePhotoButton',
    component: 'label',
    type: 'next',
    iconItem: PhotoSVG,
    children: <input onChange={capture} hidden type="file" accept="image/*" capture="environment" />,
  };

  return (
    <div>
      <Grid container justify="center">
        <Grid item xs={12} sm={10} md={9} data-role="cameraLive">
          <CustomButton args={makePhotoButton} />
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
  isPhotoTaken: PropTypes.bool.isRequired,
};

export default MobileCamera;
