import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import Footer from '../../../components/Footer';
import PhotoSVG from '../../../assets/icons/views/photo-camera.svg';
import Camera from '../../../components/Camera/Camera';
import poweredBy from '../../../assets/icons/views/powered-by.svg';
import actions from '../../../store/actions';
import { getScanValues } from '../../../store/selectors';
import blackSquare from '../../../assets/icons/views/black-square.svg';
import TranslationsContext from '../../../context/TranslationsContext';

const useStyles = () => ({
  root: {
    position: 'relative',
  },
  imgPreview: {
    width: '100%',
    height: 'calc(100vh * 0.64)',
  },
  poweredBy: {
    position: 'absolute',
    right: '10px',
    bottom: '10px',
  },
  canvas: {
    display: 'none',
  },
  item: {
    textAlign: 'center',
    position: 'relative',
  },
});

class WebcamView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isCameraEnabled: true,
      saveImage: false,
      stream: null,
      recording: true,
      videoChunks: [],
    };
    this.mediaRecorders = [];
    this.isPassport = Object.keys(props.fieldValues).find((key) => props.fieldValues[key].DocumentType === 'passport');
    this.setWebcamRef = this.setWebcamRef.bind(this);
    this.setWebStream = this.setWebStream.bind(this);
    this.retake = this.retake.bind(this);
    this.capture = this.capture.bind(this);
    this.requestCamera = this.requestCamera.bind(this);
    this.cameraResize = this.cameraResize.bind(this);
  }

  async componentDidMount() {
    const {
      component, scans, isQA, currentStep, addScan,
    } = this.props;

    if (isQA) {
      addScan(component, blackSquare, currentStep, true);
      this.setState({ saveImage: true });
      this.setWebStream();
      return;
    }

    this.setState({ saveImage: scans[currentStep] && !!scans[currentStep][component].value });

    this.setWebStream();
    document.addEventListener('keydown', this.spaceActivate, false);
    window.addEventListener('resize', this.cameraResize, false);
  }

  componentWillUnmount() {
    const { stream } = this.state;
    if (stream) stream.getTracks().forEach((track) => track.stop());
    document.removeEventListener('keydown', this.spaceActivate, false);
    window.removeEventListener('resize', this.cameraResize, false);
  }

  async setWebStream() {
    try {
      const stream = await navigator.mediaDevices
        .getUserMedia({
          audio: false,
          video: { deviceId: true, width: 1920 },
        });

      const { sdkPermissions, component } = this.props;
      if (component === 'selfie') {
        const { videoRecording, maxVideoDuration = 3 } = sdkPermissions;
        if (videoRecording && parseInt(maxVideoDuration)) {
          // start video recording
          this.initVideoRecorder(stream, maxVideoDuration);
          setTimeout(() => {
            this.initVideoRecorder(stream, maxVideoDuration);
          }, maxVideoDuration * 1000);
        }
      }

      this.cameraResize();
      this.setState({ stream });
      this.webcam.srcObject = stream;
    } catch (error) {
      console.error(error);
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

  cameraOverlay = () => null;

  cameraResize() {
    this.webcam.height = this.webcam.clientWidth * 0.64;
  }

  capture() {
    const videoElement = document.getElementById('video-capture');
    if (videoElement && videoElement.readyState !== 4) { return; }

    const {
      cameraDistance, addScan, component, currentStep,
    } = this.props;
    // draw image in canvas
    const context = this.canvas.getContext('2d');
    if (this.isPassport) {
      context.drawImage(this.webcam, -305, -20, 1355, 756);
    } else if (cameraDistance === 'far') {
      context.drawImage(this.webcam, -350, -165, 1830, 1070);
    } else {
      context.drawImage(this.webcam, -115, -20, 1355, 756);
    }

    this.stopRecording();

    const blobCallback = (blob) => {
      addScan(component, blob, currentStep, true);
      this.setState({ saveImage: true });
    };
    this.canvas.toBlob(blobCallback, 'image/jpeg', 1.0);
  }

  stopRecording() {
    this.setState({ recording: false });
    if (this.mediaRecorders.length > 0) {
      this.mediaRecorders.forEach((recorder) => { recorder.stop(); });
    }
  }

  initVideoRecorder(stream, videoDuration) {
    if (!this.state.recording) return;
    const { addScan, currentStep } = this.props;
    const startTime = Date.now() / 1000;
    const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm\;codecs=vp8' });
    this.mediaRecorders.push(mediaRecorder);

    mediaRecorder.onstop = () => {
      this.initVideoRecorder(stream, videoDuration);
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
          (chunk.time < acceptedChunk.time && chunk.time > videoDuration) ? chunk : acceptedChunk
        ));
        addScan('selfieVideo', acceptedVideo.data, currentStep, true);
      }
    };

    mediaRecorder.start();
    // stop recording and gather data after delay
    setTimeout(() => {
      if (mediaRecorder.state !== 'inactive') mediaRecorder.stop();
    }, videoDuration * 2000);
  }

  async retake() {
    const { addScan, component, currentStep } = this.props;
    addScan(component, null, currentStep, true);
    this.setState({ saveImage: false, videoChunks: [], recording: true });
    this.setWebStream();
  }

  async requestCamera() {
    this.setState(() => ({ isCameraEnabled: true }));
    this.setWebStream();
  }

  previewForm() {
    const {
      footer, component, classes, scans, currentStep,
    } = this.props;
    const { back } = footer;
    const { translations } = this.context;
    const previewFooter = {
      ...footer,
      back: {
        ...back,
        action: this.retake,
        text: translations.button_retake,
      },
    };
    const urlCreator = window.URL || window.webkitURL;
    const imageSrc = urlCreator.createObjectURL(scans[currentStep][component].value);
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
        <Footer {...previewFooter} />
      </div>
    );
  }

  render() {
    const {
      footer, cameraOverlay, classes,
    } = this.props;
    const { isCameraEnabled, saveImage } = this.state;
    const { translations } = this.context;
    const { next } = footer;

    const cameraFooter = {
      ...footer,
      next: {
        ...next,
        action: this.capture,
        text: translations.button_make_photo,
        iconItem: PhotoSVG,
        disabled: !isCameraEnabled,
      },
      isCameraEnabled,
    };

    return (
      <div className="selfie">
        {saveImage ? this.previewForm()
          : (
            <div>
              <Grid container justify="center">
                <Grid item xs={12} sm={10} md={9} data-role="cameraLive">
                  <Camera
                    isCameraEnabled={isCameraEnabled}
                    setWebcamRef={this.setWebcamRef}
                    requestCamera={this.requestCamera}
                    overlay={cameraOverlay}
                  />
                </Grid>
              </Grid>
              <Footer {...cameraFooter} />
              {/* eslint-disable-next-line no-return-assign */}
              {
                this.isPassport
                  ? (<canvas width="747" height="720" ref={(ref) => { this.canvas = ref; }} className={classes.canvas} />)
                  : (<canvas width="1125" height="720" ref={(ref) => { this.canvas = ref; }} className={classes.canvas} />)
              }
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
  scans: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  cameraDistance: PropTypes.string.isRequired,
  fieldValues: PropTypes.object.isRequired,
  isQA: PropTypes.bool,
  currentStep: PropTypes.number.isRequired,
  sdkPermissions: PropTypes.object.isRequired,
};

WebcamView.defaultProps = {
  isQA: false,
};

const mapStateToProps = (state) => ({
  scans: getScanValues(state),
});

WebcamView.contextType = TranslationsContext;

export default connect(
  mapStateToProps,
  actions,
)(withStyles(useStyles)(WebcamView));
