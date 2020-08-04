import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Form from './form';
import ThankYou from './thank-you';
import CountryAndDocument from './country-doc';
import Sending from './sending';
import {
  Selfie as IdSelfie,
  CaptureFront as DocumentPhoto,
} from './webcam';

import TranslationsContext from '../context/TranslationsContext';
import './style.css';

const transformAppIntoApiModel = (app) => app;

const allComponents = {
  Form: (app, next) => [
    (props) => <Form form={app.form} {...props} />,
    (form) => next({ form }),
  ],
  DocumentPhoto: (app, next) => [
    (props) => <DocumentPhoto blob={app.front} {...props} />,
    (front) => next({ front }),
  ],
  Selfie: (app, next) => [
    (props) => <IdSelfie blob={app.selfie} {...props} />,
    (selfie) => next({ selfie }),
  ],
  Sending: (app, next) => [
    (props) => <Sending data={transformAppIntoApiModel(app)} {...props} />,
    () => next({}),
  ],
  ThankYou: (app, next) => [
    (props) => <ThankYou {...props} />,
    () => next({}),
  ],
  CountryAndDocument: (app, next) => [
    (props) => (
      <CountryAndDocument
        country={app.country}
        documentType={app.documentType}
        {...props}
      />
    ),
    ({ country, documentType }) => next({ country, documentType }),
  ],
};

class Widget extends Component {
  constructor(props) {
    super(props);
    this.state = {
      step: 0,
      direction: 'forward',
      app: {},
      submitStep: props.flow.length - 2,
    };
  }

  nextStep = (delta) => {
    const {
      api, idCaptureBackIndex,
    } = this.props;
    const app = { ...this.state.app, ...delta };

    // await api.trySendEvent(stepName, 'completed');completed
    const { step } = this.state;
    if (step === this.state.submitStep) {
      alert(1);
    }
    this.setState({
      step: step + 1,
      direction: 'forward',
      app,
    });
  }

  prevStep = () => {
    const { step } = this.state;
    this.setState({
      step: step - 1,
      direction: 'back',
    });
  }

  finish = (delta) => {
    if (this.props.onComplete) {
      // TODO add data from server
      this.props.onComplete();
    }
  }

  render() {
    const { flow, onBack } = this.props;
    const { step, direction, app } = this.state;
    const currentComponent = flow[step];
    const { ...other } = this.props;
    if (!currentComponent) {
      return null;
    }
    const { component: componentName, ...componentProps } = currentComponent;

    console.log(step, flow.length);
    const nextStep = step < flow.length - 1 ? this.nextStep : this.finish;
    const [CurrentComponent, finishStep] = allComponents[componentName](app, nextStep);
    const prevStep = step > 0 ? this.prevStep : onBack;
    return (
      <main id="getid" data-role="container">
        <div className="getid-grid__main">
          <CurrentComponent
            finishStep={finishStep}
            prevStep={prevStep}
            direction={direction}
            {...other}
            componentName={componentName}
            {...componentProps}
          />
        </div>
      </main>
    );
  }
}

Widget.defaultProps = {
  classes: {},
  scans: {},
  flow: [],
  onComplete: null,
  onFail: null,
  onCancel: null,
  onExists: null,
  onBack: null,
  currentComponent: null,
  idCaptureBackIndex: -1,
};

Widget.propTypes = {
  flow: PropTypes.array,
  scans: PropTypes.object,
  classes: PropTypes.object,
  onComplete: PropTypes.func,
  onFail: PropTypes.func,
  onBack: PropTypes.func,
  onExists: PropTypes.func,
  onCancel: PropTypes.func,
  currentComponent: PropTypes.any,
  idCaptureBackIndex: PropTypes.number,
  api: PropTypes.object.isRequired,
};

Widget.contextType = TranslationsContext;

export default Widget;
