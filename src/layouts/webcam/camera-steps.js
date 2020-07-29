import React from 'react';
import TranslationsContext from '../../context/TranslationsContext';
import CameraDisabled from './cam-disabled';
import PreviewForm from './photo-preview';
import Footer from '../../components/blocks/footer/footer';

const getErrorText = (name, translations) => {
  if (name === 'NotAllowedError') { return 'Please enable web camera access in your browser settings.'; }
  if (name === 'NotFoundError') { return translations.camera_error_not_found; }
  return translations.camera_error_generic;
};

class WebcamView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      errorMessage: '',
      step: props.direction === 'back' ? 'preview' : 'guide',
      stream: null,
      cameraStepIsAllowed: false,
      blob: props.blob,
    };
  }

  componentWillUnmount() {
    if (this.state.stream) {
      this.state.stream.getTracks().forEach((track) => track.stop());
    }
  }

  makePhoto = () => {
    this.state.frameRenderer(this.showPreviewStep);
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

  cameraReady = (frameRenderer) => {
    this.setState({
      cameraStepIsAllowed: true,
      frameRenderer,
    });
  }

  cameraError = (error) => {
    const { translations } = this.context;
    const errorMessage = getErrorText(error.name, translations);
    this.setState(() => ({ step: 'disabled', errorMessage }));
  }

  render() {
    const {
      Camera, Guide, Placeholder, prevStep, finishStep,
    } = this.props;
    const {
      errorMessage, step, blob, cameraStepIsAllowed,
    } = this.state;

    if (step === 'disabled') {
      return (
        <div style={{ display: 'block' }}>
          <Placeholder>
            <CameraDisabled requestCamera={this.startRecordStep} errorMessage={errorMessage} />
          </Placeholder>
          <Footer />
        </div>
      );
    }
    return (
      <>
        <div style={{ display: step === 'guide' ? 'block' : 'none' }}>
          <Placeholder>
            <Guide />
          </Placeholder>
          <Footer
            disable={!cameraStepIsAllowed}
            next={this.startRecordStep}
            back={prevStep}
          />
        </div>
        <div style={{ display: step === 'record' ? 'block' : 'none' }}>
          <Placeholder>
            <Camera
              stream={this.state.stream}
              onReady={this.cameraReady}
              onError={this.cameraError}
            />
          </Placeholder>
          <Footer
            next={this.makePhoto}
            back={this.showGuideStep}
          />
        </div>
        <div style={{ display: step === 'preview' ? 'block' : 'none' }}>
          <Placeholder>
            <PreviewForm blob={blob} />
          </Placeholder>
          <Footer
            additional={{ text: 'No, retake', onClick: this.startRecordStep }}
            next={() => finishStep(blob)}
            // back={this.startRecordStep}
          />
        </div>
      </>
    );
  }
}

WebcamView.contextType = TranslationsContext;

export default (props) => (
  <div id="webcam" className="webcam" data-role="webcamContainer">
    <WebcamView {...props} />
  </div>
);
