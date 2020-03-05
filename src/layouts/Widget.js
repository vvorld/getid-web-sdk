import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Grid } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import Loader from '../components/Loader/Loader';
import UpperPart from './UpperPart';
import actions from '../store/actions';
import Footer from '../components/Footer';
import TranslationsContext from '../context/TranslationsContext';
import { stepNames } from '../constants/step-names';
import cameraViews from '../constants/camera-views';
import widgetStyles from '../assets/jss/views/Widget';
import allComponents from './views';


import {
  getIsDisabled, getStep, getFormValues, getFlow, getCurrentComponent, getScanValues,
} from '../store/selectors';
import { AppExistsView, FailError, ErrorView } from './views/ErrorView';

class Widget extends Component {
  constructor(props) {
    super(props);
    this.api = props.api;
    this.state = {
      isFail: false,
      loading: false,
      stepWithIdCaptureBack: null,
      idCaptureBackIndex: -1,
      largeGrid: 8,
      smallGrid: 10,
      appExists: false,
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
      flow, setFlow, fields,
    } = this.props;
    const duplicatedFlow = flow;
    const allFormFieldsHidden = fields.every((field) => field && field.hidden === true);

    if (allFormFieldsHidden) {
      const index = flow.indexOf(flow.find((item) => item.component.includes('Form')));
      if (index !== -1) {
        duplicatedFlow.splice(index, 1);
      }
    }

    setFlow(duplicatedFlow);
  };

  isSingleDocument = () => this.props.currentComponent.component.includes('IdCapture')
      && this.state.idCapturebackIndex < 0;

  triggerNextComponent = async () => {
    this.props.setStep(this.props.currentStep + 1);
    await this.sendStepCompleteEvent();
  };

  sendStepCompleteEvent = async () => {
    const stepName = this.isSingleDocument()
      ? stepNames.single
      : stepNames[this.props.currentComponent.component[0]];
    await this.api.trySendEvent(stepName, 'completed');
  };

  triggerPreviousComponent = () => {
    this.props.setStep(this.props.currentStep - 1);
  };

  submitData = async () => {
    await this.sendStepCompleteEvent();
    const {
      currentStep, setStep,
    } = this.props;

    setStep(currentStep);
    this.setState({ loading: true });
    await this.api.trySendEvent(stepNames.Submit, 'started');
    try {
      const submitResponse = await this.api.submitData();
      const { responseCode, exists } = submitResponse;
      if (exists) { this.setState({ appExists: true }); }
      if (responseCode === 200) {
        setTimeout(() => {
          this.setState({ loading: false });
        },
        2000);
      }
    } catch (e) {
      console.log(`Error: ${e}`);
      this.setState({ isFail: true });
    } finally {
      await this.api.trySendEvent(stepNames.Submit, 'completed');
      this.triggerNextComponent();
    }
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
          || (field.type === 'date' && Number.isNaN(Date.parse(field.value)))
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

  render() {
    const {
      currentStep,
      flow,
      currentComponent,
      onFail,
      exists,
      onExists,
      errorMessage,
    } = this.props;

    const { classes, ...other } = this.props;

    const {
      isFail, loading, idCaptureBackIndex, stepWithIdCaptureBack, largeGrid, smallGrid, appExists,
    } = this.state;

    if (!flow) return null;

    if (exists || appExists) {
      return <AppExistsView classes={classes} callbacks={{ onExists }} />;
    }
    if (errorMessage) {
      return <ErrorView classes={classes} callbacks={{ onFail }} />;
    }
    if (isFail) {
      return <FailError classes={classes} callbacks={{ onFail, onSubmit: this.submitData }} />;
    }

    if (loading) { return (<Loader />); }


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
            const index = currentComponent.component.indexOf(componentName);
            return (
              <Grid
                key={componentName + currentComponent.order.toString()}
                className={classes.component}
                item
                xs={12}
                sm={smallGrid / length}
                md={largeGrid / length}
              >
                <div className={(length > 1 && index !== 0) && classes.verticalLine}>
                  <CurrentComponent
                    footer={this.footer()}
                    {...other}
                    idCapturebackIndex={idCaptureBackIndex}
                    stepWithIdCaptureBack={stepWithIdCaptureBack}
                  />
                </div>
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
  errorMessage: '',
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
  addField: PropTypes.func.isRequired,
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
  errorMessage: PropTypes.string,
  cameraDistance: PropTypes.string,
  api: PropTypes.object.isRequired,
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
