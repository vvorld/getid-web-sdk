import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import RecordRTC from 'recordrtc-ponyfill';
import Camera from '../../../components/camera/camera';
import actions from '../../../store/actions';
import { getScanValues } from '../../../store/selectors';
import TranslationsContext from '../../../context/TranslationsContext';
import CameraDisabled from './cam-disabled';
import PreviewForm from './photo-preview';
import { isMobile } from '../../../helpers/generic';
import Guide from './guide';
import Footer from '../../../components/blocks/footer';
import Landscape from './mobile-landscape';
import PhotoSVG from '../../../assets/icons/views/photo-camera.svg';

const DESKTOP_QUALITY = 4096;
const MOBILE_QUALITY = 1280;

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
    this.isMobile = isMobile();
    this.selfieView = props.component === 'selfie';
    this.state = {
      mediaRecorder: null,
      isCameraEnabled: true,
      saveImage: false,
      errorMessage: '',
      recording: true,
      cropX: 0,
      originVideoWidth: 1280,
      videoHeight: 720,
      videoWidth: 1125,
      show: false,
      cropY: 0,
      mobileLandscape: false,
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
    if (this.state.mediaRecorder) this.state.mediaRecorder.destroy();
    if (this.stream) this.stream.getTracks().forEach((track) => track.stop());
    document.removeEventListener('keydown', this.spaceActivate, false);
    window.removeEventListener('resize', this.cameraResize, false);
  }

  async setWebStream() {
    const { translations } = this.context;
    const { sdkPermissions } = this.props;
    try {
      this.stream = await navigator.mediaDevices
        .getUserMedia({
          audio: false,
          video: {
            deviceId: true,
            width: this.isMobile ? MOBILE_QUALITY : DESKTOP_QUALITY,
            facingMode: {
              exact: this.selfieView ? 'user' : 'environment',
            },
          },
        });
      const streamSettings = this.stream.getVideoTracks()[0].getSettings();

      const { width: originVideoWidth, height: videoHeight } = streamSettings;
      const minValue = Math.min(originVideoWidth, videoHeight);
      // set width and height of original stream and stream in 25/16 ratio to state
      this.setState({
        videoHeight: this.isMobile ? minValue * (25 / 16) : minValue,
        videoWidth: this.isMobile ? minValue : minValue * (25 / 16),
        originVideoWidth: this.isMobile ? minValue : originVideoWidth,
      });
      if (this.webcam) {
        if (this.selfieView && sdkPermissions.videoRecording) return this.initVideoRecorder(this.stream);
        this.webcam.srcObject = this.stream;
      }
      this.cameraResize();
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


  spaceActivate = (e) => {
    if (e.keyCode === 32) {
      e.preventDefault();
      if (!this.state.saveImage) {
        this.capture();
      }
    }
  };

  desktopCropCoefficient = (isPassport, cameraDistance) => {
    if (isPassport) return this.setState({ cropX: 0.193, cropY: 0.036 });
    if (cameraDistance === 'far') return this.setState({ cropX: 0.161, cropY: 0.164 });
    return this.setState({ cropX: 0.033, cropY: 0.036 });
  }

  mobileCropCoefficient = (isPassport) => {
    if (this.selfieView) return this.setState({ cropX: 0.1, cropY: 0.25 })
    if (isPassport) return this.setState({ cropX: 0.093, cropY: 0.39});
    return this.setState({ cropX: 0.093, cropY: 0.4 });
  }

  cropCoefficient = () => {
    const { isPassport, cameraDistance } = this.props;
    // cropx, cropY are calculated for each available overlays
    if (this.isMobile) return this.mobileCropCoefficient(isPassport, cameraDistance);
    return this.desktopCropCoefficient(isPassport);
  };

  cameraResize = () => {
    if (this.webcam) {
      if (this.isMobile) {
        this.webcam.height = this.webcam.clientWidth * (25 / 16);
        this.webcam.width = this.webcam.clientWidth;

        return;
      }
      this.webcam.height = this.webcam.clientWidth * (16 / 25);
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
      (-videoHeight * cropY),
    );

    if (this.state.mediaRecorder) this.stopRecording();
    if (this.stream) this.stream.getTracks().forEach((track) => track.stop());

    const blobCallback = (blob) => {
      addScan(component, blob, currentStep, true);
      this.setState({ saveImage: true });
    };
    this.canvas.toBlob(blobCallback, 'image/jpeg', 1.0);
  };

  stopRecording = () => {
    const { addScan, currentStep } = this.props;
    const { mediaRecorder } = this.state;
    this.setState({ recording: false, mediaRecorder: null });
    addScan('selfie-video', null, currentStep, true);

    mediaRecorder.stopRecording(() => {
      const blob = mediaRecorder.getBlob();
      addScan('selfie-video', blob, currentStep, true);
      mediaRecorder.destroy();
    });
  };

  isMobileLandscape = () => this.isMobile && window.orientation !== 0;

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
            videoElement: this.webcam,
            frameRate: 20,
            bitrate: 2048,
          }),
        });
      } else {
        this.webcam.srcObject = stream;
      }

      if (!this.state.saveImage
        && !this.isMobileLandscape()) this.state.mediaRecorder.startRecording();
    } catch (e) {
      console.error(e);
    }
  };

  retake = async () => {
    const { addScan, component, currentStep, sdkPermissions } = this.props;
    addScan(component, null, currentStep, true);
    if (this.selfieView && sdkPermissions.videoRecording) addScan('selfie-video', null, currentStep, true);
    this.setState({ saveImage: false, recording: true });
    this.setWebStream();
  };

  requestCamera = async () => {
    this.setState(() => ({ isCameraEnabled: true }));
    await this.setWebStream();
  };

  checkMobileLandscape = () => {
    if (!this.isMobile) return;
    const { mediaRecorder } = this.state;
    if (this.isMobileLandscape()) {
      this.setState({ mobileLandscape: true });
      if (mediaRecorder) mediaRecorder.reset();
      return;
    }
    this.setState({ mobileLandscape: false });
    if (mediaRecorder) mediaRecorder.startRecording();
  }

  openComponent = () => {
    this.setState({ show: true });
    this.cropCoefficient();
    if (this.isMobile) {
      this.checkMobileLandscape();
    }
    this.setWebStream();
    document.addEventListener('keydown', this.spaceActivate, false);
    window.addEventListener('resize', this.cameraResize, false);
    window.addEventListener('orientationchange', this.checkMobileLandscape, false);
  }

  buildFooter = () => {
    const {
      footer,
    } = this.props;
    const { isCameraEnabled } = this.state;
    const { translations } = this.context;

    const cameraFooterMobile = {
      next: {
        ...footer.next,
        text: translations.button_make_photo,
        disabled: !isCameraEnabled || !this.stream || !this.webcam,
        action: this.capture,
      },
      back: {
        ...footer.back,
        text: translations.camera_mobile_back,
        theme: isCameraEnabled ? 'dark' : '',
      },
    };

    const cameraFooterDesktop = {
      ...footer,
      next: {
        ...footer.next,
        action: this.capture,
        text: translations.button_make_photo,
        iconItem: PhotoSVG,
        disabled: !isCameraEnabled || !this.stream || !this.webcam,
      },
    };

    return this.isMobile ? cameraFooterMobile : cameraFooterDesktop;
  }

  checkMobileLandscape = () => {
    if (!this.isMobile) return;
    const { mediaRecorder } = this.state;
    if (this.isMobileLandscape()) {
      this.setState({ mobileLandscape: true });
      if (mediaRecorder) {
        mediaRecorder.stopRecording();
        mediaRecorder.reset();
      }
      return;
    }
    this.setState({ mobileLandscape: false });
    if (mediaRecorder) mediaRecorder.startRecording();
  }

  openComponent = () => {
    this.setState({ show: true });
    this.cropCoefficient();
    if (!this.mobileView) {
      this.checkMobileLandscape();
      this.setWebStream();
    }

    document.addEventListener('keydown', this.spaceActivate, false);
    window.addEventListener('resize', this.cameraResize, false);
    window.addEventListener('orientationchange', this.checkMobileLandscape, false);
  }

  canvasParams = () => {
    const { videoWidth, videoHeight, cropX, cropY } = this.state;
    const mobileOverlayTop = this.props.isPassport ? 0.17 : 0.13;
    if (this.isMobile) return {
      width: videoWidth * (1 - cropX * 2),
      height: videoHeight * (1 - cropY * 2 + mobileOverlayTop),
    }
    return {
      width: videoWidth * (1 - cropX * 2),
      height: videoHeight * (1 - cropY * 2),
    }
  }

  render() {
    const {
      cameraOverlay, classes, component, scans, currentStep, mobileCameraOverlay, footer,
    } = this.props;
    const {
      errorMessage,
      isCameraEnabled,
      saveImage,
      show,
      mobileLandscape,
    } = this.state;

    const { translations } = this.context;
    if (!isCameraEnabled) {
      const message = errorMessage || translations.camera_error_generic;
      return (
        <div className={classes.mediaWrapper}>
          <CameraDisabled
            requestCamera={this.requestCamera}
            errorMessage={message}
          />
          <Footer {...(this.buildFooter())} />
        </div>
      );
    }

    const { width: canvasWidth, height: canvasHeight } = this.canvasParams();

    return (
      <div id="webcam" className="webcam" data-role="webcamContainer">
        {!show && (
          <Guide
            footer={footer}
            component={component}
            action={this.openComponent}
          />
        )}
        {show && (
          <div>
            {mobileLandscape && <Landscape />}
            {saveImage ? (
              <PreviewForm
                component={component}
                scans={scans}
                action={this.retake}
                footer={footer}
                currentStep={currentStep}
                isMobile={this.isMobile}
              />
            ) : (
                <div>
                  <Camera
                    isMobile={this.isMobile}
                    footer={this.buildFooter}
                    setWebcamRef={this.setWebcamRef}
                    overlay={this.isMobile ? mobileCameraOverlay : cameraOverlay}
                  />
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
      </div>
    );
  }
}

WebcamView.propTypes = {
  footer: PropTypes.object.isRequired,
  addScan: PropTypes.func.isRequired,
  component: PropTypes.string.isRequired,
  cameraOverlay: PropTypes.func.isRequired,
  mobileCameraOverlay: PropTypes.func.isRequired,
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
