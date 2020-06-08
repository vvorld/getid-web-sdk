import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import RecordRTC from 'recordrtc';
import Camera from '../../../components/camera/camera';
import actions from '../../../store/actions';
import { getScanValues } from '../../../store/selectors';
import TranslationsContext from '../../../context/TranslationsContext';
import CameraDisabled from './cam-disabled';
import PreviewForm from './photo-preview';
import MobileCamera from '../../../components/mobile-camera/mobile-camera';
import { isMobile } from '../../../helpers/generic';
import Footer from '../../../components/blocks/footer/footer';
import PhotoSVG from '../../../assets/icons/views/photo-camera.svg';
import Guide from './guide';


const useStyles = (theme) => ({
  subHeader: {
    ...theme.typography.subHeader,
    margin: '0 8px 30px 8px',
    [theme.breakpoints.down('sm')]: {
      marginTop: '13px',
    },
  },
});


class WebcamView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      mediaRecorder: null,
      isCameraEnabled: true,
      saveImage: false,
      errorMessage: '',
      recording: true,
      videoHeight: 720,
      videoWidth: 1125,
      originVideoWidth: 1280,
      cropX: 0,
      show: false,
      cropY: 0,
    };
    this.setWebcamRef = this.setWebcamRef.bind(this);
    this.setWebStream = this.setWebStream.bind(this);
    this.retake = this.retake.bind(this);
    this.capture = this.capture.bind(this);
    this.requestCamera = this.requestCamera.bind(this);
    this.cameraResize = this.cameraResize.bind(this);
  }

  componentDidMount() {
    const {
      component, scans, currentStep,
    } = this.props;

    if (scans && scans[currentStep] && scans[currentStep][component]) {
      this.setState({
        saveImage:
          (scans[currentStep] && !!scans[currentStep][component].value)
          || false,
      });
    }
  }

  componentWillUnmount() {
    if (this.stream) this.stream.getTracks().forEach((track) => track.stop());
    document.removeEventListener('keydown', this.spaceActivate, false);
    window.removeEventListener('resize', this.cameraResize, false);
  }

  async setWebStream() {
    const { translations } = this.context;
    const { component } = this.props;
    try {
      this.stream = await navigator.mediaDevices
        .getUserMedia({
          audio: false,
          video: { deviceId: true, width: 4096 },
        });
      const streamSettings = this.stream.getVideoTracks()[0].getSettings();
      const { width: originVideoWidth, height: videoHeight } = streamSettings;
      // set width and height of original stream and stream in 25/16 ratio to state
      this.setState({
        videoHeight,
        videoWidth: videoHeight * (25 / 16),
        originVideoWidth,
      });

      if (component === 'selfie') {
        this.recordLiveness(this.stream);
      }

      this.cameraResize();
      if (this.webcam) {
        this.webcam.srcObject = this.stream;
      }
    } catch (error) {
      if (error.name === 'NotAllowedError') {
        this.setState(() => ({ errorMessage: 'Please enable web camera access in your browser settings.' }));
      }
      if (error.name === 'NotFoundError') {
        this.setState(() => ({ errorMessage: translations.camera_error_not_found }));
      }
      if (!this.state.saveImage) {
        this.setState(() => ({ isCameraEnabled: false }));
      }
    }
  }

  setWebcamRef(webcam) {
    this.webcam = webcam;
  }

  recordLiveness = (stream) => {
    const { sdkPermissions } = this.props;

    if (sdkPermissions.videoRecording) {
      try {
        this.initVideoRecorder(stream);
      } catch (e) {
        console.error('videoRecorder', e);
      }
    }
  };

  spaceActivate = (e) => {
    if (e.keyCode === 32) {
      e.preventDefault();
      if (!this.state.saveImage) {
        this.capture();
      }
    }
  };

  cropCoefficient = () => {
    const { isPassport, cameraDistance } = this.props;
    // cropx, cropY are calculated for each available overlays
    if (isPassport) {
      this.setState({ cropX: 0.193, cropY: 0.036 });
    } else if (cameraDistance === 'far') {
      this.setState({ cropX: 0.161, cropY: 0.164 });
    } else {
      this.setState({ cropX: 0.033, cropY: 0.036 });
    }
  };

  cameraResize = () => {
    if (this.webcam) {
      this.webcam.height = this.webcam.clientWidth * 0.64;
    }
  };

  capture = () => {
    const videoElement = document.getElementById('video-capture');
    if (videoElement && videoElement.readyState !== 4) {
      return;
    }

    const { addScan, component, currentStep } = this.props;
    const {
      videoWidth, videoHeight, originVideoWidth, cropX, cropY,
    } = this.state;

    // draw image in canvas
    const context = this.canvas.getContext('2d');
    context.drawImage(
      this.webcam,
      -((originVideoWidth - videoWidth) / 2 + videoWidth * cropX),
      -videoHeight * cropY,
    );

    if (this.state.mediaRecorder) this.stopRecording();

    const blobCallback = (blob) => {
      addScan(component, blob, currentStep, true);
      this.setState({ saveImage: true });
    };
    this.canvas.toBlob(blobCallback, 'image/jpeg', 1.0);
  };

  stopRecording = () => {
    const { addScan, currentStep } = this.props;
    const { mediaRecorder } = this.state;
    this.setState({ recording: false });
    addScan('selfie-video', null, currentStep, true);

    mediaRecorder.stopRecording(() => {
      const blob = mediaRecorder.getBlob();
      addScan('selfie-video', blob, currentStep, true);
      mediaRecorder.reset();
    });
  };

  initVideoRecorder = (stream) => {
    if (!this.state.recording) return;
    const { videoHeight, videoWidth } = this.state;
    try {
      if (!this.state.mediaRecorder) {
        this.setState({
          mediaRecorder: RecordRTC(stream, {
            type: 'video',
            mimeType: 'video/webm',
            recorderType: RecordRTC.WebAssemblyRecorder,
            width: videoWidth,
            height: videoHeight,
          }),
        });
      }
      if (!this.state.saveImage) this.state.mediaRecorder.startRecording();
    } catch (e) {
      console.error(e);
    }
  };

  retake = async () => {
    const { addScan, component, currentStep } = this.props;
    addScan(component, null, currentStep, true);
    this.setState({ saveImage: false, recording: true });
    this.setWebStream();
  };

  handleFile = async (event) => {
    const { addScan, component, currentStep } = this.props;
    const eventTarget = event.target;
    const file = [...event.target.files][0];
    addScan(component,
      file,
      currentStep,
      eventTarget.required);
    this.setState({ saveImage: true });
  };

  requestCamera = async () => {
    this.setState(() => ({ isCameraEnabled: true }));
    this.setWebStream();
  };

  buildFooter = () => {
    const { footer } = this.props;
    const { isCameraEnabled, saveImage, show } = this.state;
    const { translations } = this.context;

    const cameraFooterMobile = {
      ...footer,
      next: {
        ...footer.next,
        disabled: !saveImage,
      },
    };

    const cameraFooterDesktop = {
      ...footer,
      next: {
        ...footer.next,
        action: this.capture,
        text: translations.button_make_photo,
        iconItem: PhotoSVG,
        disabled: !isCameraEnabled,
      },
      isCameraEnabled,
    };

    if (!show) {
      return {
        ...footer,
        next: {
          ...footer.next,
          text: translations.guide_accept,
          action: this.openComponent,
        },
      };
    }

    if (saveImage) {
      return {
        ...footer,
        retake: {
          ...footer.retake,
          type: 'retake',
          hidden: false,
          variant: 'outlined',
          action: this.retake,
        },
      };
    }

    return isMobile() ? cameraFooterMobile : cameraFooterDesktop;
  }

  openComponent = () => {
    this.setState({ show: true });
    this.cropCoefficient();
    if (!isMobile()) {
      this.setWebStream();
    }

    document.addEventListener('keydown', this.spaceActivate, false);
    window.addEventListener('resize', this.cameraResize, false);
  }

  render() {
    const {
      cameraOverlay, classes, component, scans, currentStep,
    } = this.props;
    const {
      errorMessage, isCameraEnabled, saveImage, videoWidth, videoHeight, cropX, cropY, show,
    } = this.state;

    const { translations } = this.context;
    if (!isCameraEnabled) {
      const message = errorMessage || translations.camera_error_generic;
      return (
        <div className={classes.mediaWrapper}>
          <CameraDisabled requestCamera={this.requestCamera} errorMessage={message} />
        </div>
      );
    }

    const canvasWidth = videoWidth * (1 - cropX * 2);
    const canvasHeight = videoHeight * (1 - cropY * 2);

    return (
      <div className="webcam" data-role="webcamContainer">
        {!show && <Guide component={component} />}
        {show && (
        <div>
          {saveImage ? (
            <PreviewForm
              component={component}
              scans={scans}
              currentStep={currentStep}
            />
          ) : (
            <div>
              {isMobile() ? (
                <MobileCamera
                  capture={this.handleFile}
                  retakeAction={this.retake}
                />
              ) : (
                <Camera
                  setWebcamRef={this.setWebcamRef}
                  overlay={cameraOverlay}
                  canvas={this.canvas}
                />
              )}
              <canvas
                width={canvasWidth}
                height={canvasHeight}
                ref={(ref) => {
                  this.canvas = ref;
                }}
                style={{ display: 'none' }}
              />
            </div>
          )}
        </div>
        )}
        <Footer {...this.buildFooter()} />
      </div>
    );
  }
}

WebcamView.propTypes = {
  footer: PropTypes.object.isRequired,
  addScan: PropTypes.func.isRequired,
  component: PropTypes.string.isRequired,
  cameraOverlay: PropTypes.func.isRequired,
  isPassport: PropTypes.bool,
  scans: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  cameraDistance: PropTypes.string.isRequired,
  currentStep: PropTypes.number.isRequired,
  sdkPermissions: PropTypes.object.isRequired,
};

WebcamView.defaultProps = {
  isPassport: false,
};

const mapStateToProps = (state) => ({
  scans: getScanValues(state),
});

WebcamView.contextType = TranslationsContext;

export default connect(
  mapStateToProps,
  actions,
)(withStyles(useStyles)(WebcamView));
