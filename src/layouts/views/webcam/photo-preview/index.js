import Grid from '@material-ui/core/Grid';
import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core';
import poweredBy from '../../../../assets/icons/views/powered-by.svg';
import Loader from '../../../../components/loader/loader';
import Footer from '../../../../components/blocks/footer';
import TranslationsContext from '../../../../context/TranslationsContext';

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
    height: '100%',
    background: theme.palette.background.dark,
    opacity: 0.5,
  },
}));

const PreviewForm = ({
  component, scans, currentStep, action, footer, isMobile,
}) => {
  const urlCreator = window.URL || window.webkitURL;
  const classes = useStyles();
  const { translations } = useContext(TranslationsContext);

  const showSpinner = (component === 'selfie'
    && scans[currentStep]['selfie-video']
    && !scans[currentStep]['selfie-video'].value) === true;

  const imageSrc = urlCreator.createObjectURL(scans[currentStep][component].value);
  const { next } = footer;

  const previewFooter = {
    ...footer,
    next: {
      ...next,
      disabled: showSpinner,
      order: isMobile ? 1 : 2,
      text: (isMobile && next.text !== translations.button_submit)
        ? translations.camera_mobile_confirm
        : next.text,
    },
    retake: {
      ...footer.retake,
      hidden: showSpinner,
      variant: 'outlined',
      order: isMobile ? 2 : 3,
      text: isMobile ? translations.camera_mobile_retake : footer.retake.text,
      action,
    },
    back: {
      ...footer.back,
      text: isMobile ? translations.camera_mobile_back : footer.back.text,
      order: isMobile ? 3 : 1,
    },
  };

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
      <Footer {...previewFooter} />
    </div>
  );
};

PreviewForm.defaultProps = {
  isMobile: false,
};

PreviewForm.propTypes = {
  component: PropTypes.string.isRequired,
  scans: PropTypes.object.isRequired,
  currentStep: PropTypes.number.isRequired,
  isMobile: PropTypes.bool,
  footer: PropTypes.shape({
    next: PropTypes.shape({
      text: PropTypes.string,
    }).isRequired,
    back: PropTypes.shape({
      text: PropTypes.string,
    }).isRequired,
    retake: PropTypes.shape({
      text: PropTypes.string,
    }).isRequired,
  }).isRequired,
  action: PropTypes.func.isRequired,
};

export default PreviewForm;
