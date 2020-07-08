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
import Header from '../../../components/blocks/header/header';

const DESKTOP_QUALITY = 4096;
const MOBILE_QUALITY = 4096;

const ID_CARD_ASPECT = 1.565;
const PASSPORT_MOBILE_ASPECT = 1.4216;
const PASSPORT_ASPECT = 1.1;
const SELFIE_MOBILE_ASPECT = 0.723;
const SELFIE_ASPECT = 1.735;
const ZOOM = 1.145;

const CROP_COEFFICIENT = {
  mobile: {
    idCard: { x: 0.07, y: 0.28 },
    passport: { x: 0.1, y: 0.29 },
    selfie: { x: 0.13, y: 0.08 },
  },
  desktop: {
    idCard: { x: 0.1, y: 0.036 },
    idCardFar: { x: 0.19, y: 0.15 },
    passport: { x: 0.22, y: 0.03 },
    selfie: { x: 0.033, y: 0.036 },
  },
};

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

    const constraints = {
      audio: false,
      video: {
        deviceId: true,
        width: this.isMobile ? MOBILE_QUALITY : DESKTOP_QUALITY,
      },
    };

    if (this.isMobile) {
      Object.assign(constraints.video, {
        facingMode: {
          exact: this.selfieView ? 'user' : 'environment',
        },
      });
    }

    try {
      this.stream = await navigator.mediaDevices
        .getUserMedia(constraints);
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
        if (this.selfieView
          && sdkPermissions.videoRecording) { return this.initVideoRecorder(this.stream); }
        this.webcam.srcObject = this.stream;
      }
      this.cameraResize();
      return null;
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
      return null;
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

  setCroppingParams = () => {
    const { isPassport, cameraDistance } = this.props;
    const coef = this.isMobile ? CROP_COEFFICIENT.mobile : CROP_COEFFICIENT.desktop;
    if (this.selfieView) return this.setState({ cropX: coef.selfie.x, cropY: coef.selfie.y });
    if (isPassport) return this.setState({ cropX: coef.passport.x, cropY: coef.passport.y });
    if (this.isMobile || cameraDistance !== 'far') {
      return this.setState({ cropX: coef.idCard.x, cropY: coef.idCard.y });
    }
    return this.setState({ cropX: coef.idCardFar.x, cropY: coef.idCardFar.y });
  }

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
      videoHeight, originVideoWidth, cropX, cropY,
    } = this.state;

    // draw image in canvas
    const context = this.canvas.getContext('2d');
    context.drawImage(
      this.webcam,
      -(originVideoWidth * cropX),
      -(videoHeight * cropY),
    );

    if (this.state.mediaRecorder) this.stopRecording();

    const blobCallback = (blob) => {
      addScan(component, blob, currentStep, true);
      this.setState({ saveImage: true });
      if (this.stream) this.stream.getTracks().forEach((track) => track.stop());
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
    const {
      addScan, component, currentStep, sdkPermissions,
    } = this.props;
    addScan(component, null, currentStep, true);
    if (this.selfieView && sdkPermissions.videoRecording) addScan('selfie-video', null, currentStep, true);
    this.setState({ saveImage: false, recording: true });
    this.setWebStream();
  };

  requestCamera = async () => {
    this.setState(() => ({ isCameraEnabled: true }));
    await this.setWebStream();
  };

  openComponent = () => {
    this.setState({ show: true });
    this.setCroppingParams();
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

  canvasParams = () => {
    const { videoWidth, cropX } = this.state;

    const width = videoWidth * (1 - cropX * 2) * (this.isMobile ? 1 : ZOOM);
    const passportAspectRatio = this.isMobile ? PASSPORT_MOBILE_ASPECT : PASSPORT_ASPECT;
    const docAspectRatio = this.props.isPassport ? passportAspectRatio : ID_CARD_ASPECT;
    const selfieAspectRatio = this.isMobile ? SELFIE_MOBILE_ASPECT : SELFIE_ASPECT;
    const aspectRatio = this.selfieView ? selfieAspectRatio : docAspectRatio;

    return {
      width,
      height: width / aspectRatio,
    };
  }

  render() {
    const {
      cameraOverlay,
      classes,
      component,
      scans,
      currentStep,
      mobileCameraOverlay,
      footer,
      currentComponent,
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
        <Header
          isPhotoPreview={saveImage && show}
          cameraComponent={component}
          currentComponent={currentComponent}
        />
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
                  isSelfie={this.selfieView}
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
  currentComponent: PropTypes.object.isRequired,
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
