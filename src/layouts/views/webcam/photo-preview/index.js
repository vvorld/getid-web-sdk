import React from 'react';
import PropTypes from 'prop-types';
import poweredBy from '../../../../assets/icons/views/powered-by.svg';
import Loader from '../../../../components/loader/loader';

const PreviewForm = ({
  component, scans, currentStep,
}) => {
  const urlCreator = window.URL || window.webkitURL;

  const showSpinner = (component === 'selfie'
    && scans[currentStep]['selfie-video']
    && !scans[currentStep]['selfie-video'].value) === true;

  const imageSrc = urlCreator.createObjectURL(scans[currentStep][component].value);

  return (
    <div>
      <div data-role="cameraPreview">
        {showSpinner && (
        <>
          <div />
          <Loader text="Processing..." />
        </>
        )}
        <img
          src={imageSrc}
          alt="current"
          data-role="cameraPreviewImg"
        />
        <img
          src={poweredBy}
          alt="powered by getId"
          data-role="poweredImg"
        />
      </div>
    </div>
  );
};

PreviewForm.propTypes = {
  component: PropTypes.string.isRequired,
  scans: PropTypes.object.isRequired,
  currentStep: PropTypes.number.isRequired,
};

export default PreviewForm;
