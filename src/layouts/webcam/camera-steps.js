import React from 'react';
import PropTypes from 'prop-types';
import TranslationsContext from '../../context/TranslationsContext';

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

class WebcamView extends React.Component {
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

  makePhoto = () => {
    this.state.frameRenderer((blob) => this.setStep('preview', blob));
  };

  setStep = (step, blob) => {
    this.setState({ step, blob });
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

  render() {
    const {
      Camera, Guide, prevStep, finishStep, componentName, onCheck, enableCheckPhoto, facingMode,
    } = this.props;
    const {
      errorMessage, step, blob, cameraStepIsAllowed, result, retakeMessage,
    } = this.state;

    console.log(blob);
    if (step === 'disabled') {
      return (
        <>
          <Header componentName={componentName} />
          <Content>
            <CameraDisabled requestCamera={() => this.setStep('record')} errorMessage={errorMessage} />
          </Content>
          <Footer />
        </>
      );
    }
    const layout = (() => {
      switch (step) {
        case 'guide': return {
          header: <Header componentName={`${componentName}_guide`} />,
          footer: <Footer
            next={{ onClick: () => this.setStep('record'), disable: !cameraStepIsAllowed }}
            back={{ onClick: prevStep }}
          />,
        };
        case 'record': return {
          header: <Header componentName={componentName} />,
          footer: !this.props.isMobile && (
          <Footer
            next={{ onClick: this.makePhoto }}
            back={{ onClick: () => this.setStep('guide') }}
          />
          ),
        };
        case 'preview': return {
          header: <Header componentName={`${componentName}_preview`} />,
          footer: <Footer
            back={{ text: 'No, retake', onClick: () => this.setStep('record') }}
            next={{ onClick: () => this.setStep('checking') }}
          />,
        };
        case 'checking': return {
          header: <Header componentName={componentName} />,
          footer: <Footer
            back={{ onClick: () => this.setStep('preview', blob) }}
          />,
        };

        case 'retake-description': return {
          header: <Header componentName={componentName} />,
          footer: <Footer
            next={{ text: 'Retake', onClick: () => this.setStep('record') }}
            back={{ text: 'Continue', onClick: () => finishStep(blob) }}
          />,
        };
        default: throw new Error(`Bad step ${step}`);
      }
    })();

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

              next={{ onClick: this.makePhoto }}
              back={{ onClick: () => this.setStep('guide') }}
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

WebcamView.contextType = TranslationsContext;

WebcamView.propTypes = {
  Camera: PropTypes.func.isRequired,
  isMobile: PropTypes.bool.isRequired,
  Guide: PropTypes.func.isRequired,
  prevStep: PropTypes.func,
  finishStep: PropTypes.func,
  direction: PropTypes.string,
  blob: PropTypes.any,
  componentName: PropTypes.string.isRequired,
  onCheck: PropTypes.func.isRequired,
  enableCheckPhoto: PropTypes.bool,
  facingMode: PropTypes.string,
};

WebcamView.defaultProps = {
  prevStep: null,
  finishStep: null,
  direction: '',
  blob: null,
  enableCheckPhoto: false,
  facingMode: '',
};

export default WebcamView;
