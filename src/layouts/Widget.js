import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Grid } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import store from '../store/store';
import Loader from '../components/Loader/Loader';
import { mapUserData } from '../helpers/tree-builder';
import UpperPart from './UpperPart';
import actions from '../store/actions';
import apiProvider from '../services/api';
import Footer from '../components/Footer';
import TranslationsContext from '../context/TranslationsContext';
import { eventNames } from '../constants/event-names';
import cameraViews from '../constants/camera-views';
import widgetStyles from '../assets/jss/views/Widget';
import allComponents from './views';

import {
  getIsDisabled, getStep, getFormValues, getFlow, getCurrentComponent, getScanValues,
} from '../store/selectors';
import ResetView from './views/ResetView';

class Widget extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isFail: false,
      loading: false,
      stepWithIdCaptureBack: null,
      idCaptureBackIndex: -1,
      largeGrid: 8,
      smallGrid: 10,
    };
  }

  componentDidMount() {
    this.getBackStepIndexAndStep();
    this.setSdkFlow();
  }

  getBackStepIndexAndStep = () => {
    const { flow } = this.props;

    this.setState(() => ({
      stepWithIdCaptureBack: flow
        .find((item) => item.component.includes('IdCaptureBack')) || {},
    }));

    this.setState((state) => ({
      idCaptureBackIndex: flow.indexOf(state.stepWithIdCaptureBack) || -1,
    }));
  };

  setSdkFlow = () => {
    const {
      flow, setFlow,
    } = this.props;

    setFlow(flow);
  };

  isSingleDocument = () => this.props.currentComponent.component.includes('IdCapture')
      && this.state.idCapturebackIndex < 0;

  triggerNextComponent = async () => {
    this.props.setStep(this.props.currentStep + 1);
    await this.sendStepCompleteEvent();
  };

  sendStepCompleteEvent = async () => {
    const { apiUrl, jwtToken } = this.props;
    const stepName = this.isSingleDocument()
      ? eventNames.single
      : eventNames[this.props.currentComponent.component[0]];
    await apiProvider.sendEvent(apiUrl, stepName, 'completed', jwtToken);
  };

  triggerPreviousComponent = () => {
    this.props.setStep(this.props.currentStep - 1);
  };

  submitData = async () => {
    await this.sendStepCompleteEvent();
    const {
      apiUrl, jwtToken, currentStep, setStep,
    } = this.props;

    setStep(currentStep);

    this.setState({ loading: true });
    await apiProvider.sendEvent(apiUrl, eventNames.Submit, 'started', jwtToken);
    try {
      const submitResponse = await apiProvider
        .submitData(mapUserData(store.getState()), jwtToken, apiUrl);
      const { responseCode } = submitResponse;
      if (responseCode === 200) {
        setTimeout(() => { this.setState({ loading: false }); }, 2000);
      }
    } catch (e) {
      console.log(`Error: ${e}`);
      this.setState({ isFail: true });
    }
    await apiProvider.sendEvent(apiUrl, eventNames.Submit, 'completed', jwtToken);
    this.triggerNextComponent();
  };

  isCameraView = () => cameraViews.some(
    (name) => this.props.currentComponent.component.includes(name),
  );

  isThankYouPage = () => this.props.currentComponent.component.includes('ThankYou');

  getType = () => {
    if (this.isButtonToSubmitData()) return 'submit';
    return (this.isThankYouPage() || this.isConsent()) && 'noIcon';
  };

  buttonAction = () => {
    if (this.isThankYouPage()) {
      return this.props.onComplete;
    }

    return this.isButtonToSubmitData() ? this.submitData : this.triggerNextComponent;
  };

  isConsent = () => this.props.currentComponent.component.includes('Consent');

  nextComponent = () => {
    const { currentComponent } = this.props;
    return currentComponent.next;
  };

  buttonText = () => {
    const { translations } = this.context;

    if (this.isThankYouPage()) return translations.button_start_over;
    if (this.isConsent() && (this.nextComponent() && !this.nextComponent().component.includes('ThankYou'))) return translations.button_agree;
    return this.isButtonToSubmitData() ? translations.button_submit : translations.button_next;
  };

  isButtonToSubmitData = () => (this.nextComponent() === null && !this.isThankYouPage())
        || (this.nextComponent() && this.nextComponent().component.includes('ThankYou'));

  footer = () => {
    const { flow, currentComponent, isDisabled } = this.props;

    return {
      isCameraView: this.isCameraView(),
      isCameraEnabled: false,
      next: {
        action: this.buttonAction(),
        text: this.buttonText(),
        className: 'isGradient',
        disabled: isDisabled,
        type: this.getType() || 'next',
      },
      back: {
        hidden: (currentComponent.order === 0 || this.isThankYouPage()) || flow.length === 1,
        action: this.triggerPreviousComponent,
        type: 'back',
        className: 'prevButton',
      },
    };
  };

  setButtonAsDisabled = () => {
    const {
      currentStep,
      setDisabled,
      fieldValues,
      scans,
    } = this.props;

    if (fieldValues[currentStep]) {
      setDisabled(Object.values(fieldValues[currentStep]).some((field) => (
        field.required
          && (field.value === null
          || field.value === ''
          || field.value === undefined
          || field.value === false
          || (/^\s+$/).test(field.value.toString())))));
    }

    if (this.isCameraView() && scans[currentStep]) {
      setDisabled(Object.values(scans[currentStep]).some((scan) => (
        scan.required
            && (scan.value === null
            || scan.value === ''
            || scan.value === undefined
            || scan.value === false))));
    }
  };

  finalViewConfig = () => {
    const { translations } = this.context;
    const { onFail, onExists } = this.props;

    return {
      exists: {
        done: {
          name: translations.done_button,
          action: onExists,
          class: 'isGradient',
        },
      },
      isFail: {
        cancel: {
          name: translations.cancel_button,
          action: onFail,
          class: 'prevButton',
        },
        retry: {
          name: translations.retry_button,
          action: this.submitData,
          class: 'isGradient',
        },
        chooseFlow: {
          name: translations.choose_flow_button,
          action: onFail,
          class: 'prevButton',
        },
      },

    };
  };

  render() {
    const {
      currentStep,
      flow,
      currentComponent,
      exists,
    } = this.props;

    const { classes, ...other } = this.props;

    const {
      isFail, loading, idCaptureBackIndex, stepWithIdCaptureBack, largeGrid, smallGrid,
    } = this.state;


    if (exists) {
      return (<ResetView classes={classes} config={this.finalViewConfig().exists} />);
    }

    if (!flow) return null;


    if (loading) {
      return (<Loader />);
    }

    if (isFail) {
      return (<ResetView classes={classes} config={this.finalViewConfig().isFail} />);
    }

    if (!currentComponent) return null;
    const { length } = currentComponent.component;
    this.setButtonAsDisabled();
    return (
      <Grid container className={classes.root} justify="center" alignItems="center" data-role="container">
        <Grid item xs={12} className={classes.item}>
          <UpperPart
            currentComponent={currentComponent}
            flow={flow}
            currentStep={currentStep}
          />
        </Grid>
        <Grid
          container
          justify="center"
          className={classes.item}
        >
          {currentComponent.component.map((componentName) => {
            const CurrentComponent = allComponents[componentName];
            return (
              <Grid
                key={componentName + currentComponent.order.toString()}
                className={classes.component}
                item
                xs={12}
                sm={smallGrid / length}
                md={largeGrid / length}
              >
                <CurrentComponent
                  footer={this.footer()}
                  {...other}
                  idCapturebackIndex={idCaptureBackIndex}
                  stepWithIdCaptureBack={stepWithIdCaptureBack}
                />
              </Grid>
            );
          })}
        </Grid>
        <Grid item xs={12} sm={9} md={12} lg={6} className={classes.item}>
          {!this.isCameraView() && <Footer {...this.footer()} />}
        </Grid>
      </Grid>
    );
  }
}

Widget.defaultProps = {
  classes: {},
  scans: {},
  flow: [],
  fields: [],
  documentData: [],
  onComplete: null,
  onFail: null,
  onCancel: null,
  onExists: null,
  fieldValues: null,
  isQA: false,
  currentComponent: null,
  showOnfidoLogo: false,
  exists: false,
  cameraDistance: 'default',
  jwtToken: '',
};

Widget.propTypes = {
  flow: PropTypes.array,
  sdkFlow: PropTypes.array.isRequired,
  fields: PropTypes.array,
  documentData: PropTypes.array,
  fieldValues: PropTypes.object,
  scans: PropTypes.object,
  formType: PropTypes.string.isRequired,
  setDisabled: PropTypes.func.isRequired,
  setStep: PropTypes.func.isRequired,
  addScan: PropTypes.func.isRequired,
  apiUrl: PropTypes.string.isRequired,
  jwtToken: PropTypes.string,
  classes: PropTypes.object,
  onComplete: PropTypes.func,
  onFail: PropTypes.func,
  onExists: PropTypes.func,
  onCancel: PropTypes.func,
  isDisabled: PropTypes.bool.isRequired,
  isQA: PropTypes.bool,
  currentStep: PropTypes.number.isRequired,
  currentComponent: PropTypes.any,
  setFlow: PropTypes.func.isRequired,
  showOnfidoLogo: PropTypes.bool,
  exists: PropTypes.bool,
  cameraDistance: PropTypes.string,
};

const mapStateToProps = (state) => ({
  fieldValues: getFormValues(state),
  isDisabled: getIsDisabled(state),
  currentStep: getStep(state),
  scans: getScanValues(state),
  sdkFlow: getFlow(state),
  currentComponent: getCurrentComponent(state),
});

Widget.contextType = TranslationsContext;

export default connect(
  mapStateToProps,
  actions,
)(withStyles(widgetStyles)(Widget));
