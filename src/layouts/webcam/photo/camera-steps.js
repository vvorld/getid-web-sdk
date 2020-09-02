import React from 'react';
import PropTypes from 'prop-types';

import Footer from '~/components/blocks/footer/footer';
import Header from '~/components/blocks/header/header';
import Content from '~/components/blocks/content';
import { CameraDisabledErrorView } from '~/components/errors';

import PreviewForm from './photo-preview';
import RetakeDescription from './retake-description';

class WebcamView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      step: props.direction === 'back' ? 'preview' : 'guide',
      stream: null,
      cameraStepIsAllowed: false,
      blob: props.blob,
      result: {},
      retakeCode: '',
      tryNumber: 1,
      checking: false,
    };
  }

  componentWillUnmount() {
    if (this.state.stream) {
      this.state.stream.getTracks().forEach((track) => track.stop());
    }
  }

  makePhoto = () => {
    this.state.frameRenderer((blob) => this.setStep('preview', { blob }));
  };

  setStep = (step, delata = {}) => {
    this.setState({ step, ...delata });
  }

  cameraReady = (frameRenderer) => {
    this.setState({
      cameraStepIsAllowed: true,
      frameRenderer,
    });
  }

  retakeDescription= ({ code }) => {
    this.setState({
      retakeCode: code,
      step: 'retake_description',
    });
  }

  cameraError = (error) => {
    this.setState(() => ({ step: 'disabled', error }));
  }

  render() {
    const {
      Camera, Guide, prevStep, finishStep, componentName,
      onCheck, enableCheckPhoto, facingMode,
      ratio,
    } = this.props;
    const {
      error, step, blob, cameraStepIsAllowed,
      result, retakeCode, tryNumber,
    } = this.state;

    const stepName = `${componentName}_${step}`;
    if (step === 'disabled') {
      return <CameraDisabledErrorView error={error.name} callbacks={{ onRetry: () => this.setStep('guide') }} />;
    }

    const layout = (() => {
      switch (step) {
        case 'guide': return {
          header: <Header step={stepName} />,
          footer: <Footer
            step={stepName}
            next={{ onClick: () => this.setStep('record'), disable: !cameraStepIsAllowed }}
            back={{ onClick: prevStep }}
          />,
        };
        case 'record': return {
          header: <Header step={stepName} />,
          footer: !this.props.isMobile && (
          <Footer
            step={stepName}
            next={{ onClick: this.makePhoto }}
            back={{ onClick: () => this.setStep('guide') }}
          />
          ),
        };
        case 'preview': return {
          header: <Header step={stepName} />,
          footer: <Footer
            step={stepName}
            back={{ text: 'No, retake', onClick: () => this.setStep('record') }}
            next={{
              onClick: () => {
                if (!onCheck || !enableCheckPhoto) {
                  finishStep(blob);
                  return;
                }
                this.setState({ checking: true });
                onCheck(blob, tryNumber)
                  .then(({ res, code }) => {
                    if (res) {
                      finishStep(blob);
                    } else {
                      this.retakeDescription({ code });
                    }
                  }).catch((e) => this.retakeDescription(e)).finally(() => {
                    this.setState({ checking: false });
                  });
              },
              disable: this.state.checking,
            }}
          />,
        };

        case 'retake_description': {
          return {
            header: <Header step={stepName} />,
            footer: <Footer
              step={stepName}
              next={{ onClick: () => this.setStep('record', { tryNumber: tryNumber + 1 }) }}
              back={{ onClick: () => finishStep(blob) }}
            />,
          };
        }
        default: throw new Error(`Bad step ${step}`);
      }
    })();
    const display = (st) => ({ display: step === st ? 'block' : 'none' });
    return (
      <>
        {layout.header}
        <Content step={stepName}>
          <div>
            <div style={display('guide')}>
              <Guide />
            </div>
            <div className="getid-camera_content" style={display('record')}>
              <Camera
                ratio={ratio}
                visible={step === 'record'}
                stream={this.state.stream}
                onReady={this.cameraReady}
                onError={this.cameraError}
                facingMode={facingMode}
                next={{ onClick: this.makePhoto }}
                back={{ onClick: () => this.setStep('guide') }}
              />
            </div>
            <div style={display('preview')}>
              <PreviewForm
                checking={this.state.checking}
                blob={blob}
                result={result}
                ratio={ratio}
              />
            </div>
            <div style={display('retake_description')}>
              <RetakeDescription step={step} code={retakeCode} rules={this.props.rules} />
            </div>
          </div>
        </Content>
        {layout.footer}
      </>
    );
  }
}

WebcamView.propTypes = {
  rules: PropTypes.string.isRequired,
  isMobile: PropTypes.bool.isRequired,
  Camera: PropTypes.func.isRequired,
  Guide: PropTypes.func.isRequired,
  prevStep: PropTypes.shape({}).isRequired,
  finishStep: PropTypes.shape({}).isRequired,
  componentName: PropTypes.string.isRequired,
  onCheck: PropTypes.func.isRequired,
  enableCheckPhoto: PropTypes.bool.isRequired,
  facingMode: PropTypes.string.isRequired,
  ratio: PropTypes.number.isRequired,
  direction: PropTypes.string.isRequired,
  blob: PropTypes.any.isRequired,
};

export default WebcamView;
