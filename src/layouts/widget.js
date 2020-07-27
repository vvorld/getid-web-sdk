import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Form from './form';
import ThankYou from './thank-you';
import CountryAndDocument from './country-doc';
import IdSelfie from './webcam/selfie';
import IdCapture from './webcam/front';
import IdCaptureBack from './webcam/back';

import Header from '../components/blocks/header/header';
import TranslationsContext from '../context/TranslationsContext';
import './style.css';

const allComponents = {
  Form, ThankYou, CountryAndDocument, IdCapture, IdSelfie, IdCaptureBack,
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
    };
  }

  nextStep = () => {
    const { step } = this.state;
    this.setState({ step: step + 1 });
    console.log('a', step + 1);
  }

  prevStep = () => {
    const { step } = this.state;
    this.setState({ step: step - 1 });
  }

  render() {
    const { flow } = this.props;
    const { step } = this.state;
    console.log('step', step);
    const currentComponent = flow[step];
    const { ...other } = this.props;

    if (!currentComponent) {
      return null;
    }
    const componentName = currentComponent.component;
    const CurrentComponent = allComponents[componentName];
    const actions = {
      nextStep: step < flow.length - 1 ? this.nextStep : undefined,
      prevStep: step > 0 ? this.prevStep : undefined,
    };
    return (
      <main id="getid" data-role="container">
        <div className="getid-grid__main">
          <Header componentName={componentName} />
          <CurrentComponent actions={actions} {...other} />
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
