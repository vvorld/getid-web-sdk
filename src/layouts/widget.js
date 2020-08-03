import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Form from './form';
import ThankYou from './thank-you';
import CountryAndDocument from './country-doc';
import {
  Selfie as IdSelfie,
  CaptureFront as IdCapture,
  CaptureBack as IdCaptureBack,
} from './webcam';

import TranslationsContext from '../context/TranslationsContext';
import './style.css';

const allComponents = {
  Form: (app, next) => [
    (props) => <Form form={app.form} {...props} />,
    (form) => next({ form }),
  ],
  IdCapture: (app, next) => [
    (props) => <IdCapture blob={app.front} {...props} />,
    (front) => next({ front }),
  ],
  IdCaptureBack: (app, next) => [
    (props) => <IdCaptureBack blob={app.back} {...props} />,
    (back) => next({ back }),
  ],
  IdSelfie: (app, next) => [
    (props) => <IdSelfie blob={app.selfie} {...props} />,
    (selfie) => next({ selfie }),
  ],
  ThankYou: (app, next) => [
    (props) => <ThankYou {...props} />,
    () => next({}),
  ],
  CountryAndDocument: (app, next) => [
    (props) => <CountryAndDocument country={app.country} documentType={app.documentType} {...props} />,
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
    };
  }

  nextStep = (delta) => {
    const {
      api, idCaptureBackIndex,
    } = this.props;

    // const stepName = getEventStepName(prevProps.currentComponent, idCaptureBackIndex);
    // await api.trySendEvent(stepName, 'completed');completed
    const { step } = this.state;
    this.setState({
      step: step + 1,
      direction: 'forward',
      app: { ...this.state.app, ...delta },
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
    console.log('delta', delta);
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
