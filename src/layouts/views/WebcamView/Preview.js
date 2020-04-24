import Grid from '@material-ui/core/Grid';
import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core';
import poweredBy from '../../../assets/icons/views/powered-by.svg';
import Footer from '../../../components/Footer';
import TranslationsContext from '../../../context/TranslationsContext';

const useStyles = makeStyles(() => ({
  root: {
    position: 'relative',
  },
  imgPreview: {
    width: '100%',
  },
  poweredBy: {
    position: 'absolute',
    right: '10px',
    bottom: '10px',
  },
}));

const PreviewForm = ({
  footer, component, scans, currentStep, retake,
}) => {
  const urlCreator = window.URL || window.webkitURL;
  const classes = useStyles();

  const { translations } = useContext(TranslationsContext);
  const imageSrc = urlCreator.createObjectURL(scans[currentStep][component].value);
  const { back } = footer;

  const footerConfig = {
    ...footer,
    back: {
      ...back,
      action: retake,
      text: translations.button_retake,
    },
  };

  return (
    <div>
      <Grid container justify="center">
        <Grid item xs={12} sm={10} md={9} className={classes.root} data-role="cameraPreview">
          <img
            src={imageSrc}
            alt="current"
            data-role="cameraPreviewImg"
            className={classes.imgPreview}
          />
          <img
            className={classes.poweredBy}
            src={poweredBy}
            alt="powered by getId"
            data-role="poweredImg"
          />
        </Grid>
      </Grid>
      <Footer {...footerConfig} />
    </div>
  );
};

PreviewForm.propTypes = {
  footer: PropTypes.shape({
    back: PropTypes.shape({}).isRequired,
  }).isRequired,
  component: PropTypes.string.isRequired,
  retake: PropTypes.func.isRequired,
  scans: PropTypes.object.isRequired,
  currentStep: PropTypes.number.isRequired,
};

export default PreviewForm;
