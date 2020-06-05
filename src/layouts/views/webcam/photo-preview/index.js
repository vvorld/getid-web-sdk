import Grid from '@material-ui/core/Grid';
import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core';
import poweredBy from '../../../../assets/icons/views/powered-by.svg';
import Loader from '../../../../components/loader/loader';

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'relative',
    color: theme.palette.white,
  },
  imgPreview: {
    width: '100%',
  },
  poweredBy: {
    position: 'absolute',
    right: '10px',
    bottom: '10px',
  },
  spinner: {
    position: 'absolute',
    width: '100%',
    height: '99%',
    background: theme.palette.background.dark,
    opacity: 0.5,
  },
}));

const PreviewForm = ({
  component, scans, currentStep,
}) => {
  const urlCreator = window.URL || window.webkitURL;
  const classes = useStyles();

  const showSpinner = (component === 'selfie'
    && scans[currentStep]['selfie-video']
    && !scans[currentStep]['selfie-video'].value) === true;

  const imageSrc = urlCreator.createObjectURL(scans[currentStep][component].value);

  return (
    <div>
      <Grid container justify="center">
        <Grid item xs={12} sm={10} md={9} className={classes.root} data-role="cameraPreview">
          {showSpinner && (
            <>
              <div className={classes.spinner} />
              <Loader text="Processing..." />
            </>
          )}
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
    </div>
  );
};

PreviewForm.propTypes = {
  component: PropTypes.string.isRequired,
  scans: PropTypes.object.isRequired,
  currentStep: PropTypes.number.isRequired,
};

export default PreviewForm;
