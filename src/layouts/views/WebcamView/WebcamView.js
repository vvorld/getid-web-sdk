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
  },
  poweredBy: {
    position: 'absolute',
    right: '10px',
    bottom: '10px',
  },
  canvas: {
    dispay: 'none',
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
    };
    this.setWebcamRef = this.setWebcamRef.bind(this);
    this.setWebStream = this.setWebStream.bind(this);
    this.retake = this.retake.bind(this);
    this.capture = this.capture.bind(this);
    this.requestCamera = this.requestCamera.bind(this);
  }

  async componentDidMount() {
    const { component, scans, isQA } = this.props;

    if (isQA) {
      this.props.addScan(this.props.component, blackSquare);
      this.setState({ saveImage: true });
      this.setWebStream();
      return;
    }

    this.setState({ saveImage: !!scans[component] });

    this.setWebStream();
    document.addEventListener('keydown', this.spaceActivate, false);
  }

  componentWillUnmount() {
    this.state.stream.getTracks().forEach((track) => track.stop());
    document.removeEventListener('keydown', this.spaceActivate, false);
  }

  async setWebStream() {
    try {
      const stream = await navigator.mediaDevices
        .getUserMedia({ audio: false, video: { deviceId: true, aspectRatio: 25 / 16 } });
      this.setState({ stream });
      this.webcam.srcObject = stream;
    } catch {
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

  capture() {
    const { cameraDistance, fieldValues } = this.props;
    // draw image in canvas
    const context = this.canvas.getContext('2d');
    if (cameraDistance === 'far'
      && Object.keys(fieldValues).find((key) => (fieldValues[key].DocumentType === 'passport'))
    ) {
      context.drawImage(this.webcam, -560, -360, 2250, 1440);
    } else {
      context.drawImage(this.webcam, 0, 0, 1125, 720);
    }
    const imageSrc = this.canvas.toDataURL('image/jpeg', 1.0);
    this.props.addScan(this.props.component, imageSrc);
    this.setState({ saveImage: true });
  }

  async retake() {
    this.props.addScan(this.props.component, null);
    this.setState({ saveImage: false });
    this.setWebStream();
  }

  async requestCamera() {
    this.setState(() => ({ isCameraEnabled: true }));
    this.setWebStream();
  }

  previewForm() {
    const { footer, component, classes } = this.props;
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

    return (
      <div>
        <Grid container justify="center">
          <Grid item xs={12} sm={10} md={9} className={classes.root} data-role="cameraPreview">
            <img
              src={this.props.scans[component]}
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
    const { translations } = this.context;
    const { next } = footer;

    const cameraFooter = {
      ...footer,
      next: {
        ...next,
        action: this.capture,
        text: translations.button_make_photo,
        iconItem: PhotoSVG,
        disabled: !this.state.isCameraEnabled,
      },
      isCameraEnabled: this.state.isCameraEnabled,
    };

    return (
      <div className="selfie">
        {this.state.saveImage ? this.previewForm()
          : (
            <div>
              <Grid container justify="center">
                <Grid item xs={12} sm={10} md={9} data-role="cameraLive">
                  <Camera
                    isCameraEnabled={this.state.isCameraEnabled}
                    setWebcamRef={this.setWebcamRef}
                    requestCamera={this.requestCamera}
                    overlay={cameraOverlay}
                  />
                </Grid>
              </Grid>
              <Footer {...cameraFooter} />
              {/* eslint-disable-next-line no-return-assign */}
              <canvas width="1125" height="720" ref={(ref) => (this.canvas = ref)} className={classes.canvas} />
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
  scans: PropTypes.array.isRequired,
  classes: PropTypes.object.isRequired,
  cameraDistance: PropTypes.object.isRequired,
  fieldValues: PropTypes.object.isRequired,
  isQA: PropTypes.bool,
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
