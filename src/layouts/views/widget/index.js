import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Grid } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import Loader from '../../../components/loader/loader';
import UpperPart from '../../../components/blocks/upper-block/upper-part';
import actions from '../../../store/actions';
import Footer from '../../../components/blocks/footer/footer';
import TranslationsContext from '../../../context/TranslationsContext';
import { stepNames } from '../../../constants/step-names';
import cameraViews from '../../../constants/camera-views';
import widgetStyles from './style';
import allComponents from '../index';
import NextIcon from '../../../assets/icons/views/arrow-next.svg';
import BackIcon from '../../../assets/icons/views/arrow-back.svg';
import { AppExistsView, FailError } from '../error';

class Widget extends Component {
  constructor(props) {
    super(props);
    this.api = props.api;
    this.state = {
      submitAttempts: 3,
      loading: false,
      largeGrid: 8,
      responseCode: 200,
      smallGrid: 10,
      appExists: false,
    };
  }

  isPage = (pageName) => this.props.currentComponent.component.includes(pageName);

  isSingleDocument = () => this.isPage('IdCapture') && this.props.idCaptureBackIndex < 0;

  triggerNextComponent = async () => {
    this.props.setStep(this.props.currentStep + 1);
    await this.sendStepCompleteEvent();
  };

  triggerPreviousComponent = () => { this.props.setStep(this.props.currentStep - 1); };

  sendStepCompleteEvent = async () => {
    const stepName = this.isSingleDocument()
      ? stepNames.Single
      : stepNames[this.props.currentComponent.component[0]];
    await this.api.trySendEvent(stepName, 'completed');
  };

  promiseTimeout = (ms, promise) => {
    const timeout = new Promise((resolve, reject) => {
      const id = setTimeout(() => {
        clearTimeout(id);
        reject(new Error(`Timed out in ${ms}ms.`));
      }, ms);
    });

    return Promise.race([
      promise,
      timeout,
    ]);
  }

  submitData = async () => {
    await this.sendStepCompleteEvent();
    const { currentStep, setStep } = this.props;
    setStep(currentStep);
    this.setState({ loading: true });
    await this.api.trySendEvent(stepNames.Submit, 'started');

    const racing = this.promiseTimeout(60000, this.api.submitData());

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

  isCameraView = () => cameraViews.some((name) => this.isPage(name));

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
      isCameraView: this.isCameraView(),
      isCameraEnabled: false,
      next: {
        attempts: 3,
        width: 12,
        direction: 'center',
        action: this.buttonAction(),
        text: this.nextButtonText(),
        className: 'isGradient',
        disabled: isDisabled,
        type: this.getType(),
        iconItem: NextIcon,
      },
      back: {
        direction: 'left',
        hidden: (currentComponent.order === 0 || this.isPage('ThankYou')) || flow.length === 1,
        action: this.triggerPreviousComponent,
        type: 'back',
        className: 'prevButton',
        iconItem: BackIcon,
        text: translations.button_back,
      },
      retake: {
        direction: 'right',
        type: 'retake',
        hidden: !this.isCameraView(),
        className: 'prevButton',
        text: translations.button_retake,
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
      const fieldsToCheck = Object.values(fieldValues[currentStep])
        .filter((field) => field.required && !field.hidden);

      setDisabled(fieldsToCheck.some((field) => {
        const { value, type } = field;

        return (value === null
            || (type === 'date' && Number.isNaN(Date.parse(value)))
            || value === ''
            || value === undefined
            || value === false
            || (/^\s+$/).test(value.toString()));
      }));
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
      currentComponent,
      onFail,
      onExists,
    } = this.props;

    const { classes, ...other } = this.props;

    const {
      loading, largeGrid, smallGrid, appExists, responseCode, submitAttempts,
    } = this.state;

    if (loading) { return (<Loader />); }

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

    if (!currentComponent) return null;
    const { length } = currentComponent.component;

    this.setButtonAsDisabled();
    return (
      <Grid container className={classes.root} justify="center" alignItems="center" data-role="container">
        <Grid item xs={12} className={classes.item}>
          <UpperPart />
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
                <div className={(length > 1 && index !== 0) ? classes.verticalLine : ''}>
                  <CurrentComponent
                    footer={this.footer()}
                    {...other}
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
  cameraDistance: 'default',
  idCaptureBackIndex: -1,
};

Widget.propTypes = {
  flow: PropTypes.array,
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
  classes: PropTypes.object,
  onComplete: PropTypes.func,
  onFail: PropTypes.func,
  onExists: PropTypes.func,
  onCancel: PropTypes.func,
  isDisabled: PropTypes.bool.isRequired,
  isQA: PropTypes.bool,
  currentStep: PropTypes.number.isRequired,
  currentComponent: PropTypes.any,
  idCaptureBackIndex: PropTypes.number,
  cameraDistance: PropTypes.string,
  api: PropTypes.object.isRequired,
};

Widget.contextType = TranslationsContext;

export default connect(
  null,
  actions,
)(withStyles(widgetStyles)(Widget));
