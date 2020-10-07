import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Footer from '~/components/blocks/footer';
import Header from '~/components/blocks/header/header';
import Content from '~/components/blocks/content';
import { ErrorView } from '~/components/errors';

import Camera from '../photo/camera';
import createLivenessSession from './liveness-session';
import createSelfieSession from './selfie-session';
import createOverlay from '../photo/overlay';
import Translation from '~/components/blocks/translations';

const renderWarning = (warning) => {
  switch (warning.warningType) {
    case 'otherAction': return (
      <div>
        <div>
          <Translation step="LivenessCommand" element="expected" />
          {': '}
          <Translation step="LivenessCommand" element={warning.otherAction.task} />
        </div>
        <br />
        <div>
          <Translation step="LivenessCommand" element="detected" />
          {': '}
          <Translation step="LivenessCommand" element={warning.otherAction.detected} />
        </div>
      </div>
    );
    case 'sessionError': return <Translation step="LivenessError" element={warning.sessionError} />;
    default: return <>{warning.warningType}</>;
  }
};
const renderFailure = (failure) => {
  switch (failure.errorType) {
    case 'tooManyWarnings': return <Translation step="LivenessError" element="tooManyWarnings" />;
    case 'faceDetectionError': return <Translation step="LivenessError" element={failure.faceDetectionError} />;
    case 'sessionError': return <Translation step="LivenessError" element={failure.sessionError} />;
    default: return <Translation step="LivenessError" element="faceDetectionError" />;
  }
};
const Placeholder = createOverlay('none');
const Command = ({
  task, messageType, warning, failure, ...other
}) => {
  console.log(other);
  if (!messageType) {
    return <Placeholder {...other} />;
  }

  return (
    <>
      <Placeholder {...other} />
      <div className="getid-phrases__container getid-liveness ">
        <div className="getid-phrases__content getid-row">
          {messageType === 'taskComplete' && (
          <>
            <span className="getid-success-icon getid-command-icon" />
            <Translation step="LivenessCommand" element="success" />
          </>
          )}
          {messageType === 'task' && (
          <>
            <span className={`getid-${task}-icon getid-command-icon`} />
            <Translation step="LivenessCommand" element={task} />
          </>
          )}
          {messageType === 'warning' && (
          <>
            <span className="getid-warning-icon getid-command-icon" />
            {renderWarning(warning)}
          </>
          )}

          {messageType === 'failure' && (
          <>
            <span className="getid-fail-icon getid-command-icon" />
            {renderFailure(failure)}
          </>
          )}

          {messageType === 'success' && (
          <>
            <span className="getid-success-icon getid-command-icon" />
            <Translation step="LivenessCommand" element="thanks" />
          </>
          )}

        </div>
      </div>
    </>
  );
};

Command.propTypes = {
  task: PropTypes.string,
  messageType: PropTypes.string,
  warning: PropTypes.string,
  failure: PropTypes.string,
};

Command.defaultProps = {
  task: '',
  messageType: '',
  warning: '',
  failure: '',
};

class LivenessStep extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      stream: null,
      step: 'Ready',
      faceIsOk: false,
    };
  }

  cameraReady = async (takePhoto) => {
    if (this.state.stopLivenessSession) {
      this.state.stopLivenessSession();
    }
    if (this.state.stopFaceSession) {
      this.state.stopFaceSession();
    }
    const faceResult = (data) => {
      if (data.messageType === 'faceDetectionError') {
        if (this.state.faceIsOk) {
          this.setState({ faceIsOk: false });
        }
      } else if (!this.state.faceIsOk) {
        this.setState({ faceIsOk: true });
      }
    };
    await createSelfieSession(
      this.props.servers,
      this.props.jwt,
      takePhoto,
      faceResult,
      this.setServerError,
      (stopFaceSession) => {
        this.setState({
          step: 'Ready',
          takePhoto,
          stopFaceSession,
        });
      },
    );
  }

  readyStep = async () => {
    this.setState({
      step: 'Ready',
    });
  }

  setServerError = (error) => {
    this.setState({ step: 'Error', error });
  }

  componentWillUnmount() {
    if (this.state.stopFaceSession) {
      this.state.stopFaceSession();
    }
    if (this.state.stopLivenessSession) {
      this.state.stopLivenessSession();
    }
    if (this.state.stream) {
      this.state.stream.getTracks().forEach((track) => track.stop());
    }
  }

  startLiveness = async () => {
    if (this.state.stopFaceSession) {
      this.state.stopFaceSession();
    }
    const onCommand = (command, next) => {
      switch (command.messageType) {
        case 'failure': {
          this.setState({
            command,
            nextCommand: {
              translate: 'again',
              onClick: this.readyStep,
            },
          });
          break;
        }
        case 'success': {
          this.setState({
            command,
            nextCommand: {
              onClick: () => this.props.finishStep({ artifacts: command.artifacts }),
            },
          });
          break;
        }
        default: {
          this.setState({
            command,
            nextCommand: {
              translate: 'undestand',
              onClick: next,
            },
          });
          break;
        }
      }
    };
    await createLivenessSession(
      this.props.servers,
      this.props.jwt,
      this.state.takePhoto,
      onCommand,
      this.setServerError,
      (sessionStop) => this.setState({
        step: 'Command',
        nextCommand: undefined,
        command: undefined,
        stopLivenessSession: sessionStop,
        stopFaceSession: undefined,
      }),
    );
  }

  cameraError = (error) => {
    this.setState(() => ({ step: 'Error', error }));
  }

  render() {
    const {
      prevStep,
    } = this.props;
    const {
      error, step, command, faceIsOk, nextCommand,
    } = this.state;
    const stepName = `Liveness${step}`;
    if (step === 'Error') {
      return (
        <ErrorView
          error={error}
          onRetry={this.readyStep}
        />
      );
    }
    const Overlay = createOverlay('rectangle', faceIsOk ? 'success' : 'error');
    return (
      <>
        <Header step={stepName} />
        <Content step="Liveness">
          <Camera
            width={320}
            ratio={1}
            facingMode="user"
            Overlay={step === 'Ready' ? Overlay : (props) => <Command {...props} {...command} />}
            onReady={this.cameraReady}
            onError={this.cameraError}
            active
          />
        </Content>
        {step === 'Ready' ? (
          <Footer
            step={stepName}
            next={{ onClick: this.startLiveness, disable: !faceIsOk }}
            back={{ onClick: prevStep }}
          />
        )
          : (
            <Footer
              step={stepName}
              next={nextCommand}
              back={{ onClick: prevStep }}
            />
          )}

      </>
    );
  }
}

LivenessStep.propTypes = {
  prevStep: PropTypes.func,
  direction: PropTypes.string,
  finishStep: PropTypes.func,
  servers: PropTypes.array.isRequired,
  jwt: PropTypes.string.isRequired,

};

LivenessStep.defaultProps = {
  prevStep: null,
  direction: '',
  finishStep: null,
};

export default LivenessStep;
