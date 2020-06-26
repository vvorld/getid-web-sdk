import React from 'react';
import PropTypes from 'prop-types';
import Camera from '../../components/camera/camera';
import TranslationsContext from '../../context/TranslationsContext';
import CameraDisabled from './cam-disabled';
import PreviewForm from './photo-preview';
import { isMobile } from '../../helpers/generic';
import Footer from '../../components/blocks/footer/footer';
import Guide from './guide';

const cropCoefficient = (isPassport, cameraDistance) => {
  // cropx, cropY are calculated for each available overlays
  if (isPassport) {
    return { cropX: 0.193, cropY: 0.036 };
  } if (cameraDistance === 'far') {
    return { cropX: 0.161, cropY: 0.164 };
  }
  return { cropX: 0.033, cropY: 0.036 };
};

class WebcamView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      errorMessage: '',
      step: 'guide',
    };
  }

  componentWillUnmount() {
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
    }
  }

  setWebStream = async (webcam) => {
    this.webcam = webcam;
    try {
      if (!this.stream) {
        this.stream = await navigator.mediaDevices
          .getUserMedia({
            audio: false,
            video: { deviceId: true, width: 4096 },
          });
      }

      this.webcam.srcObject = this.stream;
    } catch (error) {
      console.error(error);
      if (error.name === 'NotAllowedError') {
        this.setState(() => ({ step: 'disabled', errorMessage: 'Please enable web camera access in your browser settings.' }));
        return;
      }
      const { translations } = this.context;
      if (error.name === 'NotFoundError') {
        this.setState(() => ({ step: 'disabled', errorMessage: translations.camera_error_not_found }));
        return;
      }
      this.setState(() => ({ step: 'disabled', errorMessage: translations.camera_error_generic }));
    }
  }

  setWebcamRef = (webcam) => {
    if (webcam) {
      this.setWebStream(webcam);
    }
  }

  makePhoto = () => {
    if (this.webcam && this.webcam.readyState !== 4) {
      return;
    }

    const streamSettings = this.stream.getVideoTracks()[0].getSettings();
    const { width, height } = streamSettings;

    // draw image in canvas
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');
    // const { isPassport, cameraDistance } = this.props;
    // const { cropX, cropY } = cropCoefficient(isPassport, cameraDistance);
    context.drawImage(
      this.webcam,
      0, // -((width - videoWidth) / 2 + videoWidth * cropX),
      0, // -height * cropY,
    );

    canvas.toBlob(this.showPreviewStep, 'image/jpeg', 1.0);
  };

  handleFile = async (event) => {
    this.showPreview();
  };

  startRecordStep = () => {
    this.setState({ step: 'record' });
  }

  showPreviewStep = (blob) => {
    this.setState({ step: 'preview', blob });
  }

  showGuideStep = () => {
    this.setState({ step: 'guide' });
  }

  render() {
    const { cameraOverlay, component, actions } = this.props;
    const { errorMessage, step, blob } = this.state;

    switch (step) {
      case 'disabled':
        return (
          <>
            <CameraDisabled requestCamera={this.startRecordStep} errorMessage={errorMessage} />
            <Footer />
          </>
        );
      case 'guide': return (
        <>
          <Guide component={component} />
          <Footer
            next={this.startRecordStep}
            back={actions.prevStep}
          />
        </>
      );
      case 'preview': return (
        <>
          <PreviewForm blob={blob} />
          <Footer
            next={actions.nextStep}
            back={this.startRecordStep}
          />
        </>
      );
      case 'record': return (
        <>
          <div>
            <Camera
              setWebcamRef={this.setWebcamRef}
              overlay={cameraOverlay}
              isMobile={isMobile()}
              capture={this.handleFile}
            />
          </div>
          <Footer
            next={this.makePhoto}
            back={this.showGuideStep}
          />
        </>
      );
      default:
        throw new Error(`Bad step value: ${step}`);
    }
  }
}

WebcamView.propTypes = {
  component: PropTypes.string.isRequired,
  cameraOverlay: PropTypes.func.isRequired,
  isPassport: PropTypes.bool,
  cameraDistance: PropTypes.string.isRequired,
};

WebcamView.defaultProps = {
  isPassport: false,
};

WebcamView.contextType = TranslationsContext;

export default (props) => (
  <div id="webcam" className="webcam" data-role="webcamContainer">
    <WebcamView {...props} />
  </div>
);
