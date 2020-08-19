import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Footer from '../../components/blocks/footer/footer';
import Header from '../../components/blocks/header/header';
import Content from '../../components/blocks/content';

import CameraDisabled from './cam-disabled';
import PreviewForm from './photo-preview';
import Checking from './checking';
import RetakeDescription from './retake-description';

const getErrorText = (name, translations) => {
  if (name === 'NotAllowedError') { return 'Please enable web camera access in your browser settings.'; }
  if (name === 'NotFoundError') { return translations.camera_error_not_found; }
  return translations.camera_error_generic;
};

class WebcamView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errorMessage: '',
      step: props.direction === 'back' ? 'preview' : 'guide',
      stream: null,
      cameraStepIsAllowed: false,
      blob: props.blob,
      result: {},
      retakeMessage: '',
    };
  }

  componentWillUnmount() {
    if (this.state.stream) {
      this.state.stream.getTracks().forEach((track) => track.stop());
    }
  }

  startRecordStep = () => {
    this.setState({ step: 'record' });
  }

  showPreviewStep = (blob) => {
    this.setState({ step: 'preview', blob });
  }

  showGuideStep = () => {
    this.setState({ step: 'guide' });
  }

  showCheckStep = () => {
    this.setState({ step: 'checking' });
  }

  cameraReady = (frameRenderer) => {
    this.setState({
      cameraStepIsAllowed: true,
      frameRenderer,
    });
  }

  retakeDescription= ({ message }) => {
    this.setState({
      retakeMessage: message,
      step: 'retake-description',
    });
  }

  cameraError = (error) => {
    const { translations } = this.context;
    const errorMessage = getErrorText(error.name, translations);
    this.setState(() => ({ step: 'disabled', errorMessage }));
  }

  finishRecord = () => {
    throw new Error('Please impolement');
  }

  layout = () => {
    const { cameraStepIsAllowed } = this.state;
    const { prevStep, componentName, isMobile } = this.props;
    switch (step) {
      case 'guide': return {
        header: <Header componentName={`${componentName}_guide`} />,
        footer: <Footer
          next={{ onClick: this.startRecordStep, disable: !cameraStepIsAllowed }}
          back={{ onClick: prevStep }}
        />,
      };
      case 'record': return {
        header: <Header componentName={componentName} />,
        footer: !isMobile && (
          <Footer
            next={{ onClick: this.finishRecord }}
            back={{ onClick: this.showGuideStep }}
          />
        ),
      };
      default: return null;
    }
  }

  render() {
    const {
      Camera, Guide, finishStep, facingMode,
    } = this.props;
    const {
      errorMessage, step, blob, result, retakeMessage, componentName,
    } = this.state;

    if (step === 'disabled') {
      return (
        <>
          <Header componentName={componentName} />
          <Content>
            <CameraDisabled requestCamera={this.startRecordStep} errorMessage={errorMessage} />
          </Content>
          <Footer />
        </>
      );
    }
    const layout = this.layout();

    return (
      <>
        {layout.header}
        <Content>
          <div style={{ display: step === 'guide' ? 'block' : 'none' }}>
            <Guide />
          </div>
          <div style={{ display: step === 'record' ? 'block' : 'none' }}>
            <Camera
              stream={this.state.stream}
              onReady={this.cameraReady}
              onError={this.cameraError}
              facingMode={facingMode}

              next={{ onClick: this.finishRecord }}
              back={{ onClick: this.showGuideStep }}
            />
          </div>
          <div style={{ display: step === 'preview' ? 'block' : 'none' }}>
            <PreviewForm blob={blob} result={result} />
          </div>
          <div style={{ display: step === 'retake-description' ? 'block' : 'none' }}>
            <RetakeDescription message={retakeMessage} />
          </div>
          {step === 'checking'
            ? (
              <Checking
                enable={enableCheckPhoto}
                onCheck={onCheck}
                blob={blob}
                onSuccess={() => finishStep(blob)}
                onFail={this.retakeDescription}
              />
            )
            : null}
        </Content>
        {layout.footer}
      </>
    );
  }
}

WebcamView.propTypes = {
  Camera: PropTypes.func.isRequired,
  Guide: PropTypes.func.isRequired,
  Placeholder: PropTypes.func.isRequired,
  prevStep: PropTypes.func,
  finishStep: PropTypes.func,
  direction: PropTypes.string,
  blob: PropTypes.any,
};

WebcamView.defaultProps = {
  prevStep: null,
  finishStep: null,
  direction: '',
  blob: null,
};

export default WebcamView;
