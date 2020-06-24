import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Form from './form';
import ThankYou from './thank-you';
import CountryAndDocument from './country-doc';
import IdSelfie from './webcam/selfie';
import IdCapture from './webcam/front';
import IdCaptureBack from './webcam/back';

import Loader from '../components/loader/loader';
import Header from '../components/blocks/header/header';
import actions from '../store/actions';
import TranslationsContext from '../context/TranslationsContext';
import { stepNames } from '../constants/step-names';
import { AppExistsView, FailError } from './error';
import { promiseTimeout, getEventStepName } from '../helpers/generic';
import css from './style.css';

const allComponents = {
  Form, ThankYou, CountryAndDocument, IdCapture, IdSelfie, IdCaptureBack,
};
class Widget extends Component {
  constructor(props) {
    super(props);
    this.api = props.api;
    this.state = {
      submitAttempts: 3,
      loading: false,
      responseCode: 200,
      appExists: false,
    };
  }

  componentDidUpdate() {
    this.props.setButtonAsDisabled();
  }

  isPage = (pageName) => this.props.currentComponent.component.includes(pageName);

  triggerNextComponent = async () => {
    this.props.goToStep(this.props.currentStep + 1);
  };

  triggerPreviousComponent = () => { this.props.goToStep(this.props.currentStep - 1); };

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
    await this.prepare();
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

  getType = () => {
    if (this.isButtonToSubmitData()) return 'submit';
    if (this.isPage('ThankYou') || this.isPage('Consent')) return 'noIcon';
    return 'next';
  };

  buttonAction = () => {
    if (this.isPage('ThankYou')) {
      return this.props.onComplete;
    }

    return this.isButtonToSubmitData() ? this.submitData : this.triggerNextComponent;
  };

  nextComponent = () => this.props.currentComponent.next;

  nextButtonText = () => {
    const { translations } = this.context;

    if (this.isPage('ThankYou')) return translations.button_start_over;
    if (this.isPage('Consent') && (this.nextComponent() && !this.nextComponent().component.includes('ThankYou'))) return translations.button_agree;
    return this.isButtonToSubmitData() ? translations.button_submit : translations.button_next;
  };

  isButtonToSubmitData = () => (this.nextComponent() === null && !this.isPage('ThankYou'))
        || (this.nextComponent() && this.nextComponent().component.includes('ThankYou'));

  footer = () => {
    const { flow, currentComponent, isDisabled } = this.props;
    const { translations } = this.context;

    return {
      next: {
        action: this.buttonAction(),
        text: this.nextButtonText(),
        disabled: isDisabled,
        type: this.getType(),
      },
      back: {
        hidden: (currentComponent.order === 0 || this.isPage('ThankYou')) || flow.length === 1,
        action: this.triggerPreviousComponent,
        text: translations.button_back,
      },
      retake: {
        hidden: true,
        text: translations.button_retake,
      },
    };
  };

  render() {
    const {
      currentComponent,
      onFail,
      onExists,
    } = this.props;

    const { ...other } = this.props;
    const {
      loading, appExists, responseCode, submitAttempts,
    } = this.state;

    if (loading) {
      return (
        <div>
          <Loader text="Sending data..." />
        </div>
      );
    }

    if (appExists) {
      return <AppExistsView callbacks={{ onExists }} />;
    }

    if (responseCode !== 200) {
      return (
        <FailError
          submitAttempts={submitAttempts}
          responseCode={responseCode}
          callbacks={{ onFail, onSubmit: this.submitData }}
        />
      );
    }

    if (!currentComponent) {
      return null;
    }
    const componentName = currentComponent.component;
    const CurrentComponent = allComponents[componentName];
    return (
      <main id="getid" data-role="container">
        <div className={css.grid}>
          <Header componentName={componentName} />
          <CurrentComponent footer={this.footer()} {...other} />
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

export default connect(
  null,
  actions,
)(Widget);
