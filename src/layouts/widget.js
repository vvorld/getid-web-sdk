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

import Header from '../components/blocks/header/header';
import TranslationsContext from '../context/TranslationsContext';
import css from './style.css';

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
    (props) => <CountryAndDocument country={app.country} type={app.type} {...props} />,
    (country, type) => next({ country, type }),
  ],

};

/*
prepare = async () => {
    const {
      currentStep, goToStep, currentComponent, idCaptureBackIndex,
    } = this.props;
    await this.api.trySendEvent(getEventStepName(currentComponent, idCaptureBackIndex), 'completed');
    goToStep(currentStep);
    this.setState({ loading: true });
    await this.api.trySendEvent(stepNames.Submit, 'started');
  }

  submitData = async () => {
    const racing = promiseTimeout(60000, this.api.submitData());

    racing.then(async (res) => {
      const { responseCode, exists } = res;
      if (exists) { this.setState({ appExists: true }); }
      if (responseCode >= 500) {
        this.dealWithResponse(500);
        return;
      }

      if (responseCode >= 400 && responseCode < 500) {
        this.dealWithResponse(400);
        return;
      }

      this.dealWithResponse(200);
      await this.api.trySendEvent(stepNames.Submit, 'completed');
      await this.triggerNextComponent();
    }).catch((e) => {
      console.log(e);
      this.dealWithResponse(null);
    });
  };

    dealWithResponse = (code) => {
    setTimeout(() => {
      this.setState((state) => ({
        responseCode: code,
        loading: false,
        submitAttempts: state.submitAttempts - 1,
      }));
    }, 2000);
  }

  */
class Widget extends Component {
  constructor(props) {
    super(props);
    this.state = {
      step: 0,
      direction: 'forvard',
      app: {},
    };
  }

  nextStep = (delta) => {
    const { step } = this.state;
    this.setState({
      step: step + 1,
      direction: 'forvard',
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

  }

  render() {
    const { flow } = this.props;
    const { step, direction, app } = this.state;
    console.log('app:', app);
    const currentComponent = flow[step];
    const { ...other } = this.props;
    if (!currentComponent) {
      return null;
    }
    const componentName = currentComponent.component;
    const nextStep = step < flow.length - 1 ? this.nextStep : this.finish;
    const [CurrentComponent, finishStep] = allComponents[componentName](app, nextStep);
    const prevStep = step > 0 ? this.prevStep : undefined;
    return (
      <main id="getid" data-role="container">
        <div className={css.grid}>
          <Header componentName={componentName} />
          <CurrentComponent
            finishStep={finishStep}
            prevStep={prevStep}
            direction={direction}
            {...other}
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
  currentComponent: null,
  idCaptureBackIndex: -1,
};

Widget.propTypes = {
  flow: PropTypes.array,
  scans: PropTypes.object,
  setButtonAsDisabled: PropTypes.func.isRequired,
  goToStep: PropTypes.func.isRequired,
  classes: PropTypes.object,
  onComplete: PropTypes.func,
  onFail: PropTypes.func,
  onExists: PropTypes.func,
  onCancel: PropTypes.func,
  isDisabled: PropTypes.bool.isRequired,
  currentStep: PropTypes.number.isRequired,
  currentComponent: PropTypes.any,
  idCaptureBackIndex: PropTypes.number,
  api: PropTypes.object.isRequired,
};

Widget.contextType = TranslationsContext;

export default Widget;
