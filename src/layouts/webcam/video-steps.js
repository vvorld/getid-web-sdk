import React from 'react';
import PropTypes from 'prop-types';

import Footer from '../../components/blocks/footer/footer';
import Header from '../../components/blocks/header/header';
import Content from '../../components/blocks/content';
import createRecordCamera from './video';
import CameraDisabled from './cam-disabled';
import PreviewVideo from './video-preview';
import { isMobile } from '../../helpers/generic';

const getErrorText = (name, translations) => {
  if (name === 'NotAllowedError') { return 'Please enable web camera access in your browser settings.'; }
  if (name === 'NotFoundError') { return translations.camera_error_not_found; }
  return translations.camera_error_generic;
};

class RecordView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      errorMessage: '',
      step: props.direction === 'back' ? 'preview' : 'guide',
      stream: null,
      cameraStepIsAllowed: false,
      blob: props.blob,
      result: {},
    };
    this.createComponents();
  }

  componentWillUnmount() {
    if (this.state.stream) {
      this.state.stream.getTracks().forEach((track) => track.stop());
    }
  }

  createComponents = () => {
    const { props } = this;
    const { Camera, CameraFooter } = createRecordCamera({
      server: props.server,
      phrases: props.phrases,
      stream: this.state.stream,
      onReady: this.cameraReady,
      onError: this.cameraError,
      facingMode: props.facingMode,

      next: { onClick: this.showPreviewStep, text: 'Show preview' },
      back: { onClick: this.showGuideStep },
    });
    this.Camera = Camera;
    this.CameraFooter = CameraFooter;
  }

  makeVideo = () => {
    this.state.stopRecord(this.showPreviewStep);
  };

  startRecordStep = () => {
    this.setState({ step: 'record' });
  }

  showPreviewStep = (loadRecord) => {
    this.setState({ step: 'preview', loadRecord });
  }

  showGuideStep = () => {
    this.setState({ step: 'guide' });
  }

  cameraReady = (stopRecord) => {
    this.setState({
      cameraStepIsAllowed: true,
      stopRecord,
    });
  }

  cameraError = (error) => {
    const { translations } = this.context;
    const errorMessage = getErrorText(error.name, translations);
    this.setState(() => ({ step: 'disabled', errorMessage }));
  }

  render() {
    const {
      Guide, prevStep,
    } = this.props;
    const {
      errorMessage, step, loadRecord, cameraStepIsAllowed, blob,
    } = this.state;
    const stepName = `Recording_${step}`;

    if (step === 'disabled') {
      return (
        <>
          <Header step={stepName} />
          <Content step={stepName}>
            <CameraDisabled requestCamera={this.startRecordStep} errorMessage={errorMessage} />
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
            next={{ onClick: this.startRecordStep, disable: !cameraStepIsAllowed }}
            back={{ onClick: prevStep }}
          />,
        };

        case 'record': {
          const { CameraFooter } = this;
          return {
            header: <Header step={stepName} />,
            footer: <CameraFooter step={stepName} />,
          };
        }
        case 'preview': return {
          header: <Header step={stepName} />,
          footer: <Footer
            step={stepName}
            next={{ onClick: () => this.props.finishStep(blob) }}
            back={{
              onClick: () => {
                this.createComponents();
                this.startRecordStep();
              },
            }}
          />,
        };
        default: throw new Error(`Bad step ${step}`);
      }
    })();
    const { Camera } = this;
    const mobile = isMobile();
    return (
      <>
        {layout.header}
        <Content step={stepName} disableAnmation={step === 'record' && mobile}>
          <div style={{ display: step === 'guide' ? 'block' : 'none' }}>
            <Guide />
          </div>
          <div style={{ display: step === 'record' ? 'block' : 'none' }}>
            <Camera active visible={step === 'record'} isMobile={mobile} />
          </div>
          <div style={{ display: step === 'preview' ? 'block' : 'none' }}>
            <PreviewVideo
              onLoad={(b) => this.setState({ blob: b })}
              load={loadRecord}
              blob={blob}
            />
          </div>
        </Content>
        {layout.footer}
      </>
    );
  }
}

RecordView.propTypes = {
  Camera: PropTypes.func.isRequired,
  Guide: PropTypes.func.isRequired,
  Placeholder: PropTypes.func.isRequired,
  prevStep: PropTypes.func,
  finishStep: PropTypes.func,
  direction: PropTypes.string,
  blob: PropTypes.any,
};

RecordView.defaultProps = {
  prevStep: null,
  finishStep: null,
  direction: '',
  blob: null,
};

export default RecordView;
