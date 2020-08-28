import React, { Component, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Camera from './photo/camera';
import Footer from '~/components/blocks/footer/footer';
import Header from '~/components/blocks/header/header';
import Content from '~/components/blocks/content';
import CameraDisabled from './cam-disabled';
import { isMobile } from '~/helpers/generic';
import createLivenessSession from './liveness';

const getErrorText = (name, translations) => {
  if (name === 'NotAllowedError') { return 'Please enable web camera access in your browser settings.'; }
  if (name === 'NotFoundError') { return translations.camera_error_not_found; }
  return translations.camera_error_generic;
};

const mapTasks = {
  smile: 'Smile',
  closeEyes: 'Close your eyes',
  turnRight: 'Turn your head to the right',
  turnLeft: 'Turn your head to the left',
  tiltLeft: 'Tilt your head to the left',
  tiltRight: 'Tilt your head to the right',
};

const Command = ({ s, children }) => {
  const [{ text, type }, setText] = useState({});
  s.delegate = setText;
  return (
    <div style={{
      background: '#7861A2',
      display: 'flex',
      justifyContent: 'center',
      flexDirection: 'column',
      fontSize: '1.6em',
      marginTop: '-25px',
      borderRadius: '5px',
      position: 'relative',

    }}
    >
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
          {mapTasks[text] || text}
        </div>
      </div>

    </div>
  );
};

const createComponentLiveness = (server, takePhoto) => () => {
  const sessionActions = {};
  const [sessionNumber, setSessionNumber] = useState(1);

  const createLiveness = () => createLivenessSession(server, takePhoto, (data) => {
    if (data.type === 'fail') {
      setTimeout(() => {
        setSessionNumber(sessionNumber + 1);
      }, 3000);

      sessionActions.delegate(data);
    } else {
      sessionActions.delegate(data);
    }
  });
  useEffect(() => { createLiveness(); }, [sessionNumber]);
  return (
    <Command s={sessionActions}>
      <div>
        {'Try '}
        {sessionNumber}
      </div>
    </Command>
  );
};

class LivenessStep extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errorMessage: '',
      step: props.direction === 'back' ? 'preview' : 'guide',
      stream: null,
      cameraStepIsAllowed: false,
      LivenessCommands: createComponentLiveness(props.server, (c) => this.state.takePhoto(c)),
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
    const { translations } = this.context;
    const errorMessage = getErrorText(error.name, translations);
    this.setState(() => ({ step: 'disabled', errorMessage }));
  }

  render() {
    const {
      Guide, prevStep,
    } = this.props;
    const {
      errorMessage, step, cameraStepIsAllowed, LivenessCommands,
    } = this.state;
    const stepName = `Recording_${step}`;

    if (step === 'disabled') {
      return (
        <>
          <Header step={stepName} />
          <Content step={stepName}>
            <CameraDisabled requestCamera={this.startLiveness} errorMessage={errorMessage} />
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
        <Content step={stepName} disableAnmation={step === 'liveness' && isMobile()}>
          <div style={{ display: step === 'guide' ? 'block' : 'none' }}>
            <Guide />
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
  Guide: PropTypes.func.isRequired,
  prevStep: PropTypes.func,
  direction: PropTypes.string,
};

LivenessStep.defaultProps = {
  prevStep: null,
  direction: '',
};

export default LivenessStep;
