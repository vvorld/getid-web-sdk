import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Footer from '~/components/blocks/footer';
import Header from '~/components/blocks/header/header';
import Content from '~/components/blocks/content';
import { CameraDisabledErrorView } from '~/components/errors';

import Camera from '../photo/camera';
import createLivenessSession from './session';
import createLivenessSession2 from './session2';
import createOverlay from '../photo/overlay';

const mapTasks = {
  smile: 'Smile',
  closeEyes: 'Close your eyes',
  turnRight: 'Turn your head to the right',
  turnLeft: 'Turn your head to the left',
  tiltLeft: 'Tilt your head to the left',
  tiltRight: 'Tilt your head to the right',
};

const taskText = (task) => mapTasks[task] || task;

const renderWarning = (warning) => {
  switch (warning.warningType) {
    case 'otherAction': return (
      <>
        Expected:
        {taskText(warning.otherAction.task) }
        <br />
        Detected:
        {taskText(warning.otherAction.detected) }
      </>
    );
    case 'sessionError': return (
      <>
        {warning.sessionError}
      </>
    );
    default: return <>{warning.warningType}</>;
  }
};
const renderFailure = (failure) => {
  switch (failure.errorType) {
    case 'tooManyWarnings': return (
      <>
        Fail: Too many warnings
      </>
    );
    case 'faceDetectionError': return (
      <>
        Fail:
        {' '}
        {failure.faceDetectionError}
      </>
    );
    case 'sessionError': return (
      <>
        {failure.sessionError}
      </>
    );
    default: return (
      <>
        Fail:
        {' '}
        {failure.errorType}
      </>
    );
  }
};
const Command = ({
  task, messageType, warning, failure,
}) => {
  if (!messageType) {
    return null;
  }
  return (
    <div className="getid-phrases__container getid-liveness ">
      <div className="getid-phrases__content">
        {messageType === 'taskComplete' && (
        <>
          <span className="getid-success-icon getid-command-icon" />
          Great!
        </>
        )}
        {messageType === 'task' && (
        <>
          <span className={`getid-${task}-icon getid-command-icon`} />
          {taskText(task)}
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
          Good! Thanks
        </>
        )}

      </div>
    </div>
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

  componentWillUnmount() {
    if (this.state.stream) {
      this.state.stream.getTracks().forEach((track) => track.stop());
    }
  }

  readyStep = (takePhoto) => {
    if (this.state.stopLivenessSession) {
      this.state.stopLivenessSession();
    }
    const stopFaceSession = createLivenessSession2(this.props.servers, takePhoto, (data) => {
      if (data.messageType === 'faceDetectionError') {
        if (this.state.faceIsOk) {
          this.setState({ faceIsOk: false });
        }
      } else if (!this.state.faceIsOk) {
        this.setState({ faceIsOk: true });
      }
    });
    this.setState({
      step: 'Ready',
      takePhoto,
      stopFaceSession,
    });
  }

  startLiveness = () => {
    if (this.state.stopFaceSession) {
      this.state.stopFaceSession();
    }
    const sessionStop = createLivenessSession(this.props.servers,
      this.state.takePhoto,
      (command, next) => {
        switch (command.messageType) {
          case 'failure': {
            sessionStop();
            this.setState({
              command,
              nextCommand: {
                translate: 'again',
                onClick: () => this.readyStep(this.state.takePhoto),
              },
            });
            break;
          }
          case 'success': {
            sessionStop();
            this.setState({
              command,
              nextCommand: {
                onClick: () => this.props.finishStep(),
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
      });
    this.setState({
      step: 'Command',
      nextCommand: undefined,
      command: undefined,
      stopLivenessSession: sessionStop,
      stopFaceSession: undefined,
    });
  }

  cameraError = (error) => {
    this.setState(() => ({ step: 'Disabled', error }));
  }

  render() {
    const {
      prevStep,
    } = this.props;
    const {
      error, step, command, faceIsOk, nextCommand,
    } = this.state;
    const stepName = `Liveness${step}`;

    if (step === 'disabled') {
      return (
        <CameraDisabledErrorView
          error={error.name}
          callbacks={{ onRetry: this.startLiveness }}
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
            Overlay={step === 'Ready' ? Overlay : () => <Command {...command} />}
            onReady={this.readyStep}
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
  servers: PropTypes.array,
};

LivenessStep.defaultProps = {
  prevStep: null,
  direction: '',
  finishStep: null,
  servers: [],
};

export default LivenessStep;
