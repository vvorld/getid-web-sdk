import React from 'react';
import PropTypes from 'prop-types';
import Guide from '~/components/guide';
import Footer from '~/components/blocks/footer';
import Header from '~/components/blocks/header/header';
import Content from '~/components/blocks/content';
import Preview from './preview';
import { CameraDisabledErrorView, ServerErrorView } from '~/components/errors';

import createRecordCamera from './record';

class RecordView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      step: props.direction === 'back' ? 'preview' : 'guide',
      cameraStepIsAllowed: false,
      blob: props.blob,
    };
    this.createComponents();
  }

  componentWillUnmount() {
    if (this.state.stopRecord) {
      this.state.stopRecord();
    }
  }

  createComponents = () => {
    const { props } = this;
    const { Camera, CameraFooter, CameraHeader } = createRecordCamera({
      fallbackServers: props.fallbackServers,
      phrases: props.phrases,
      onReady: this.cameraReady,
      onError: this.cameraError,
      facingMode: { exact: 'environment' },

      next: { onClick: this.showPreviewStep, text: 'Show preview' },
      back: { onClick: this.showGuideStep },
    });
    this.Camera = Camera;
    this.CameraFooter = CameraFooter;
    this.CameraHeader = CameraHeader;
  }

  makeVideo = () => {
    this.state.stopRecord(this.showPreviewStep);
  };

  startRecordStep = () => {
    this.setState({ step: 'record', blob: null, loadRecord: null });
  }

  showPreviewStep = (loadRecord) => {
    this.setState({ step: 'preview', loadRecord });
  }

  showGuideStep = () => {
    this.createComponents();
    this.setState({ step: 'guide' });
  }

  cameraReady = (stopRecord) => {
    this.setState({
      cameraStepIsAllowed: true,
      stopRecord,
    });
  }

  cameraError = (error) => {
    this.setState(() => ({ step: 'disabled', error }));
  }

  render() {
    const { prevStep } = this.props;
    const {
      error, step, loadRecord, cameraStepIsAllowed, blob,
    } = this.state;
    const stepName = `Recording_${step}`;

    if (step === 'disabled') {
      const Error = error.name === 'webrtc' ? ServerErrorView : CameraDisabledErrorView;
      return (
        <Error
          error={error.name}
          callbacks={{ onRetry: this.showGuideStep }}
        />
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
          const { CameraFooter, CameraHeader } = this;
          return {
            header: <CameraHeader />,
            footer: <CameraFooter />,
          };
        }
        case 'preview': return {
          header: <Header step={stepName} />,
          footer: <Footer
            step={stepName}
            next={{ onClick: () => this.props.finishStep(blob), disable: !blob }}
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
    const mainButton = document.getElementById('main');
    if (mainButton) document.getElementById('main').focus();
    const display = (st) => ({ display: step === st ? 'block' : 'none' });
    return (
      <>
        {layout.header}
        <Content step={stepName}>
          <div style={display('guide')}>
            <Guide name="recordingDesktop" styles={this.props.styles} />
          </div>
          {step !== 'preview' && (
          <div className="getid-camera_content" style={display('record')}>
            <Camera active visible={step === 'record'} step={stepName} />
          </div>
          )}
          <div style={display('preview')}>
            <Preview
              onLoad={(b) => this.setState({ blob: b, loadRecord: null })}
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
  prevStep: PropTypes.func,
  finishStep: PropTypes.func,
  phrases: PropTypes.array,
  direction: PropTypes.string,
  blob: PropTypes.any,
  servers: PropTypes.array,
  styles: PropTypes.shape({}).isRequired,
};

RecordView.defaultProps = {
  prevStep: null,
  phrases: [],
  finishStep: null,
  direction: '',
  servers: [],
  blob: null,
};

export default RecordView;
