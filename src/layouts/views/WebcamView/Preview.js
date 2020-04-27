import Grid from '@material-ui/core/Grid';
import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core';
import poweredBy from '../../../assets/icons/views/powered-by.svg';
import Footer from '../../../components/Footer';

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
  footer, component, scans, currentStep, retakeAction,
}) => {
  const urlCreator = window.URL || window.webkitURL;
  const classes = useStyles();

  const imageSrc = urlCreator.createObjectURL(scans[currentStep][component].value);

  const { retake } = footer;
  const footerConfig = {
    ...footer,
    retake: {
      ...retake,
      action: retakeAction,
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
    retake: PropTypes.shape({}).isRequired,
  }).isRequired,
  component: PropTypes.string.isRequired,
  retakeAction: PropTypes.func.isRequired,
  scans: PropTypes.object.isRequired,
  currentStep: PropTypes.number.isRequired,
};

export default PreviewForm;
