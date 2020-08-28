import React from 'react';

import Footer from '~/components/blocks/footer/footer';
import Header from '~/components/blocks/header/header';
import Content from '~/components/blocks/content';

import CameraDisabled from '../cam-disabled';
import PreviewForm from './photo-preview';
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
    const { translations } = this.context;
    const errorMessage = getErrorText(error.name, translations);
    this.setState(() => ({ step: 'disabled', errorMessage }));
  }

  render() {
    const {
      Camera, Guide, prevStep, finishStep, componentName,
      onCheck, enableCheckPhoto, facingMode,
      ratio,
    } = this.props;
    const {
      errorMessage, step, blob, cameraStepIsAllowed,
      result, retakeCode, tryNumber,
    } = this.state;

    const stepName = `${componentName}_${step}`;
    if (step === 'disabled') {
      return (
        <>
          <Header step={stepName} />
          <Content step={stepName}>
            <CameraDisabled requestCamera={() => this.setStep('record')} errorMessage={errorMessage} />
          </Content>
          <Footer step={stepName} />
        </>
      );
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
    return (
      <>
        {layout.header}
        <Content step={stepName} disableAnmation={step === 'record'}>
          <div>
            <div style={{ display: step === 'guide' ? 'block' : 'none' }}>
              <Guide />
            </div>
            <div style={{ display: step === 'record' ? 'block' : 'none', borderRadius: '10px', overflow: 'hidden' }}>
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
            <div style={{ display: step === 'preview' ? 'block' : 'none' }}>
              <PreviewForm
                checking={this.state.checking}
                blob={blob}
                result={result}
                ratio={ratio}
              />
            </div>
            <div style={{ display: step === 'retake_description' ? 'block' : 'none' }}>
              <RetakeDescription step={step} code={retakeCode} rules={this.props.rules} />
            </div>
          </div>
        </Content>
        {layout.footer}
      </>
    );
  }
}

export default WebcamView;
