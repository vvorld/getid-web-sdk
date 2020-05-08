import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import Camera from '../../../components/camera/camera';
import actions from '../../../store/actions';
import { getScanValues } from '../../../store/selectors';
import TranslationsContext from '../../../context/TranslationsContext';
import CameraDisabled from './cam-disabled';
import PreviewForm from './photo-preview';
import MobileCamera from '../../../components/mobile-camera/mobile-camera';
import { isMobile } from '../../../helpers/generic';

const useStyles = (theme) => ({
  subHeader: {
    margin: '0 8px 30px 8px',
    fontSize: '15px',
    fontStyle: 'normal',
    fontWeight: 'normal',
    lineHeight: '22px',
    color: theme.palette.blueDark,
    opacity: '0.7',
    [theme.breakpoints.down('sm')]: {
      marginTop: '13px',
    },
  },
});

class WebcamView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isCameraEnabled: true,
      saveImage: false,
      errorMessage: '',
      recording: true,
      videoChunks: [],
      videoHeight: 720,
      videoWidth: 1125,
      originVideoWidth: 1280,
      cropX: 0,
      cropY: 0,
    };
    this.mediaRecorders = [];
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


    this.cropCoefficient();
    this.setWebStream();

    document.addEventListener('keydown', this.spaceActivate, false);
    window.addEventListener('resize', this.cameraResize, false);
  }

  componentWillUnmount() {
    if (this.stream) this.stream.getTracks().forEach((track) => track.stop());
    this.stopRecording();
    document.removeEventListener('keydown', this.spaceActivate, false);
    window.removeEventListener('resize', this.cameraResize, false);
  }

  async setWebStream() {
    if (isMobile()) return;
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

    const { videoRecording, maxVideoDuration } = sdkPermissions;
    let duration = maxVideoDuration;
    if (typeof maxVideoDuration !== 'number') {
      duration = parseInt(maxVideoDuration, 10);
    }

    if (videoRecording && !Number.isNaN(duration)) {
      try {
        // start video recording
        this.initVideoRecorder(stream, duration);
        setTimeout(() => {
          this.initVideoRecorder(stream, duration);
        }, duration * 1000);
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

  cameraOverlay = () => null;

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

    this.stopRecording();

    const blobCallback = (blob) => {
      addScan(component, blob, currentStep, true);
      this.setState({ saveImage: true });
    };
    this.canvas.toBlob(blobCallback, 'image/jpeg', 1.0);
  };

  stopRecording = () => {
    this.setState({ recording: false });
    if (this.mediaRecorders.length > 0) {
      this.mediaRecorders.forEach((recorder) => {
        recorder.stop();
      });
    }
  };

  initVideoRecorder = (stream, maxVideoDuration) => {
    if (!this.state.recording) return;
    const { addScan, currentStep } = this.props;
    const startTime = Date.now() / 1000;
    try {
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp8' });
      this.mediaRecorders.push(mediaRecorder);

      mediaRecorder.onstop = () => {
        this.initVideoRecorder(stream, maxVideoDuration);
      };

      mediaRecorder.ondataavailable = ({ data }) => {
        // store chunk with data
        const duration = Date.now() / 1000 - startTime;
        const { videoChunks } = this.state;
        if (videoChunks.length > 1) videoChunks.shift();
        videoChunks.push({ time: duration, data });
        this.setState({ videoChunks });

        this.mediaRecorders.shift();
        // filter and store video in case no more recorders are running
        if (this.mediaRecorders.length === 0) {
          const acceptedVideo = this.state.videoChunks.reduce((acceptedChunk, chunk) => (
            (chunk.time < acceptedChunk.time && chunk.time > maxVideoDuration)
              ? chunk : acceptedChunk
          ));
          addScan('selfieVideo', acceptedVideo.data, currentStep, true);
        }
      };

      mediaRecorder.start();
      // stop recording and gather data after delay
      setTimeout(() => {
        if (mediaRecorder.state !== 'inactive') mediaRecorder.stop();
      }, maxVideoDuration * 2000);
    } catch (e) {
      console.error(e);
    }
  };

  retake = async () => {
    const { addScan, component, currentStep } = this.props;
    addScan(component, null, currentStep, true);
    this.setState({ saveImage: false, videoChunks: [], recording: true });
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

  render() {
    const {
      footer, cameraOverlay, classes, component, scans, currentStep,
    } = this.props;
    const {
      errorMessage, isCameraEnabled, saveImage, videoWidth, videoHeight, cropX, cropY,
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
      <div className="webcam">
        <div className={classes.subHeader}>{translations.camera_access_tooltip}</div>
        {saveImage ? (
          <PreviewForm
            footer={footer}
            component={component}
            scans={scans}
            currentStep={currentStep}
            retakeAction={this.retake}
          />

        ) : (
          <div>
            {isMobile() ? (
              <MobileCamera
                isPhotoTaken={saveImage}
                footer={footer}
                capture={this.handleFile}
                retakeAction={this.retake}
              />
            ) : (
              <Camera
                isCameraEnabled={isCameraEnabled}
                setWebcamRef={this.setWebcamRef}
                overlay={cameraOverlay}
                footer={footer}
                capture={this.capture}
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