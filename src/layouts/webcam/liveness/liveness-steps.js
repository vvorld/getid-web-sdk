import React, { Component, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import Footer from '~/components/blocks/footer/footer';
import Header from '~/components/blocks/header/header';
import Content from '~/components/blocks/content';
import Guide from '~/components/guide';
import { CameraDisabledErrorView } from '~/components/errors';

import Camera from '../photo/camera';
import createLivenessSession from './session';

import ErrorIcon from '~/assets/icons/error-icon.svg';

const mapTasks = {
  smile: 'Smile',
  closeEyes: 'Close your eyes',
  turnRight: 'Turn your head to the right',
  turnLeft: 'Turn your head to the left',
  tiltLeft: 'Tilt your head to the left',
  tiltRight: 'Tilt your head to the right',
};

const mapAnimations = {
  smile: 'https://cdn.getid.cloud/assets/liveness/smile.svg',
  closeEyes: 'https://cdn.getid.cloud/assets/liveness/close-eyes.svg',
  turnRight: 'https://cdn.getid.cloud/assets/liveness/turn-right.svg',
  turnLeft: 'https://cdn.getid.cloud/assets/liveness/turn-left.svg',
  tiltLeft: 'https://cdn.getid.cloud/assets/liveness/turn-left.svg',
  tiltRight: 'https://cdn.getid.cloud/assets/liveness/turn-right.svg',
  warning: ErrorIcon,
  fail: ErrorIcon,
};

const Command = ({ s, children }) => {
  const [{ text, type, next }, setTask] = useState({});
  s.delegate = setTask;
  return (
    <div className="getid-phrases__container getid-liveness">
      <div style={{
        color: 'white',
        padding: '20px',
        borderRadius: '15px',
      }}
      >
        <div style={{
          fontWeight: 'bold',
          transition: 'opacity 0.6s',
          color: type === 'warning' ? 'red' : 'white',
          opacity: 2 === 'hide' ? 0 : 1,
        }}
        >
          {children}
          {type !== 'warning' && (<Result text={mapTasks[text] || text} type={text} />)}
          {type === 'warning' && (
          <div>
            <Result text="Wrong (need to add some text)" type={type} />
            <button
              style={{
                color: 'white',
                cursor: 'pointer',
              }}
              type="button"
              onClick={next}
            >
              Continue
            </button>
          </div>
          )}

          {type === 'fail' && (
          <div>
            <button
              style={{
                color: 'white',
                cursor: 'pointer',
              }}
              type="button"
              onClick={next}
            >
              Try again
            </button>
          </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Result = ({ text, type }) => (
  <div style={{
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  }}
  >
    {mapAnimations[type] && <img alt="liveness_image" className="getid-liveness_image" src={mapAnimations[type]} />}
    {text && <div>{text}</div>}
  </div>
);

const createComponentLiveness = (servers, takePhoto, success) => () => {
  const sessionActions = {};
  const [sessionNumber, setSessionNumber] = useState(1);

  const createLiveness = () => createLivenessSession(servers, takePhoto, (data) => {
    switch (data.type) {
      case 'fail': {
        sessionActions.delegate({ ...data, next: () => setSessionNumber(sessionNumber + 1) });
        break;
      }
      case 'success': {
        success();
        break;
      }
      default: {
        sessionActions.delegate(data);
        break;
      }
    }
  });
  useEffect(() => { createLiveness(); }, [sessionNumber]);
  return (
    <Command s={sessionActions}>
      <div>
        {`Try ${sessionNumber}`}
      </div>
    </Command>
  );
};

class LivenessStep extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      step: props.direction === 'back' ? 'preview' : 'guide',
      stream: null,
      cameraStepIsAllowed: false,
      LivenessCommands: createComponentLiveness(
        props.servers,
        (c) => this.state.takePhoto(c, true),
        props.finishStep,
      ),
    };
  }

  componentWillUnmount() {
    if (this.state.stream) {
      this.state.stream.getTracks().forEach((track) => track.stop());
    }
  }

  showGuideStep = () => {
    this.setState({ step: 'guide' });
  }

  cameraReady = (takePhoto) => {
    this.setState({
      takePhoto,
      cameraStepIsAllowed: true,
    });
  }

  startLiveness = () => {
    this.setState({ step: 'liveness' });
  }

  cameraError = (error) => {
    this.setState(() => ({ step: 'disabled', error }));
  }

  render() {
    const {
      prevStep,
    } = this.props;
    const {
      error, step, cameraStepIsAllowed, LivenessCommands,
    } = this.state;
    const stepName = `Liveness_${step}`;

    if (step === 'disabled') {
      return (
        <CameraDisabledErrorView
          error={error.name}
          callbacks={{ onRetry: this.startLiveness }}
        />
      );
    }

    const layout = (() => {
      switch (step) {
        case 'guide': return {
          header: <Header step={stepName} />,
          footer: <Footer
            step={stepName}
            next={{ onClick: this.startLiveness, disable: !cameraStepIsAllowed }}
            back={{ onClick: prevStep }}
          />,
        };

        case 'liveness': {
          return {
            header: <Header step={stepName} />,
            footer: <Footer
              step={stepName}
              next={{ onClick: this.props.next, disable: !cameraStepIsAllowed }}
              back={{ onClick: prevStep }}
            />,
          };
        }

        default: throw new Error(`Bad step ${step}`);
      }
    })();

    return (
      <>
        {layout.header}
        <Content step={stepName}>
          <div style={{ display: step === 'guide' ? 'block' : 'none' }}>
            <Guide src="https://cdn.getid.cloud/assets/desktop/recording.svg" styles={this.props.styles} />
          </div>
          <div style={{ display: step === 'liveness' ? 'block' : 'none' }}>
            <Camera Overlay={step === 'liveness' ? LivenessCommands : null} active visible={step === 'liveness'} onReady={this.cameraReady} />
          </div>
        </Content>
        {layout.footer}
      </>
    );
  }
}

LivenessStep.propTypes = {
  prevStep: PropTypes.func,
  direction: PropTypes.string,
};

LivenessStep.defaultProps = {
  prevStep: null,
  direction: '',
};

export default LivenessStep;
