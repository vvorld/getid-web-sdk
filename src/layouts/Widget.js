import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import store from '../store/store';
import Loader from '../components/Loader/Loader';
import {
  mapFieldData, mapScans, getDonorToken,
} from '../helpers/tree-builder';
import UpperPart from './UpperPart';
import actions from '../store/actions';
import apiProvider from '../services/api';
import Footer from '../components/Footer';
import TranslationsContext from '../context/TranslationsContext';
import { eventNames } from '../constants/event-names';
import cameraViews from '../constants/camera-views';
import widgetStyles from '../assets/jss/views/Widget';

import {
  getIsDisabled, getStep, getFormValues, getFlow, getCurrentComponent,
} from '../store/selectors';
import ResetView from './views/ResetView';

class Widget extends Component {
  constructor(props) {
    super(props);
    const { flow } = this.props;
    this.idCapturebackIndex = flow.indexOf('IdCaptureBack');

    this.state = {
      isFail: false,
      loading: false,
    };
  }

  componentDidMount() {
    const {
      flow, setFlow,
    } = this.props;

    setFlow(flow);
    this.loadScans();
  }

  loadScans = () => {
    const { scans, addScan } = this.props;
    if (scans) {
      scans.forEach((scan) => {
        addScan(scan.name, scan.value);
      });
    }
  };

  isSingleDocument = () => this.CurrentComponent().name === 'IdCapture' && this.idCapturebackIndex < 0;

  triggerNextComponent = async () => {
    this.props.setStep(this.props.currentStep + 1);
    await this.sendStepCompleteEvent();
  };

  sendStepCompleteEvent = async () => {
    const { apiUrl, jwtToken } = this.props;
    const stepName = this.isSingleDocument()
      ? eventNames.single
      : eventNames[this.CurrentComponent().name];
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
    const userData = {};

    Object.assign(userData, {
      donorToken: getDonorToken(),
      requests:
          [{
            fields: mapFieldData(store.getState().fields),
            scans: mapScans(store.getState().scans),
          }],
    });

    apiProvider.submitData(userData, jwtToken, apiUrl).then((res) => {
      apiProvider.sendEvent(apiUrl, eventNames.Submit, 'started', jwtToken);
      res.json().then(async (data) => {
        setTimeout(() => { this.setState({ loading: false }); }, 2000);
        if (data.responseCode !== 200) {
          console.log(`Error: ${data.errorMessage}`);
          this.setState({ isFail: true });
          return;
        }
        await apiProvider.sendEvent(apiUrl, eventNames.Submit, 'completed', jwtToken);
        this.triggerNextComponent();
      });
    });
  };

  isCameraView = () => cameraViews.includes(this.CurrentComponent().name);

  isThankYouPage = () => this.CurrentComponent().name === 'ThankYou';

  getType = () => (this.isThankYouPage() || this.isConsent()) && 'noIcon';

  buttonAction = () => {
    if (this.isThankYouPage()) {
      return this.props.onComplete;
    }

    return this.isButtonToSubmitData() ? this.submitData : this.triggerNextComponent;
  };

  isConsent = () => this.CurrentComponent().name === 'Consent';

  buttonText = () => {
    const { translations } = this.context;
    if (this.isThankYouPage()) return translations.button_start_over;
    if (this.isConsent()) return translations.button_agree;
    return this.isButtonToSubmitData() ? translations.button_submit : translations.button_next;
  };

  resetFormConfig = (translations) => ({
    cancel: {
      name: translations.cancel_button,
      action: this.props.onFail,
      class: 'prevButton',
    },
    retry: {
      name: translations.retry_button,
      action: this.submitData,
      class: 'isGradient',
    },
    chooseFlow: {
      name: translations.choose_flow_button,
      action: this.props.onFail,
      class: 'prevButton',
    },
  });

  CurrentComponent = () => this.props.currentComponent || null;

  isForm = () => this.CurrentComponent().name === 'Form';

  notFirst = () => this.CurrentComponent().order !== 0;

  isButtonToSubmitData() {
    return (this.CurrentComponent().next.component === null && !this.isThankYouPage())
        || this.CurrentComponent().next.name === 'ThankYou';
  }

  footer() {
    const { flow } = this.props;
    return {
      isCameraView: this.isCameraView(),
      isCameraEnabled: false,
      next: {
        action: this.buttonAction(),
        text: this.buttonText(),
        disabled: this.props.isDisabled,
        type: this.getType() || 'next',
      },
      back: {
        hidden: (!this.notFirst() || this.isThankYouPage()) || flow.length === 1,
        action: this.triggerPreviousComponent,
        type: 'back',
      },
    };
  }

  render() {
    const { translations } = this.context;
    const {
      currentStep,
      setDisabled,
      fieldValues,
      flow,
    } = this.props;

    const { classes, ...other } = this.props;

    const { isFail, loading } = this.state;
    if (!flow) return null;

    if (loading) {
      return (
        <Loader />
      );
    }

    if (isFail) {
      return (
        <Grid container className={classes.root} justify="center" alignItems="center">
          <Grid item xs={12} sm={9} md={7} lg={6} className={classes.item}>
            <ResetView buttonConfig={this.resetFormConfig(translations)} />
          </Grid>
        </Grid>
      );
    }

    if (!this.CurrentComponent()) return null;

    const LoadingComponent = this.CurrentComponent();
    const { idCapturebackIndex } = this;

    if (!fieldValues[currentStep]) {
      setDisabled(false);
    } else {
      setDisabled(Object.values(fieldValues[currentStep]).some((item) => (
        item === null
          || item === ''
          || item === undefined
          || item === false
          || (/^\s+$/).test(item))));
    }

    return (
      <Grid container className={classes.root} justify="center" alignItems="center" data-role="container">
        <Grid item xs={12} className={classes.item}>
          <UpperPart
            currentComponent={LoadingComponent}
            flow={flow}
            currentStep={currentStep}
          />
        </Grid>
        <Grid item xs={12} sm={9} md={7} lg={6} className={classes.item}>
          <LoadingComponent.component
            footer={this.footer()}
            {...other}
            idCapturebackIndex={idCapturebackIndex}
          />
          {!this.isCameraView() && <Footer {...this.footer()} />}
        </Grid>
      </Grid>
    );
  }
}

Widget.defaultProps = {
  classes: {},
  scans: [],
  flow: [],
  fields: [],
  documentData: [],
  onComplete: null,
  onFail: null,
  onCancel: null,
  fieldValues: null,
  isQA: false,
  currentComponent: null,
  showOnfidoLogo: false,
};

Widget.propTypes = {
  flow: PropTypes.array,
  sdkFlow: PropTypes.array.isRequired,
  fields: PropTypes.array,
  documentData: PropTypes.array,
  fieldValues: PropTypes.object,
  scans: PropTypes.array,
  formType: PropTypes.string.isRequired,
  addField: PropTypes.func.isRequired,
  setDisabled: PropTypes.func.isRequired,
  setStep: PropTypes.func.isRequired,
  addScan: PropTypes.func.isRequired,
  apiUrl: PropTypes.string.isRequired,
  jwtToken: PropTypes.string.isRequired,
  classes: PropTypes.object,
  onComplete: PropTypes.func,
  onFail: PropTypes.func,
  onCancel: PropTypes.func,
  isDisabled: PropTypes.bool.isRequired,
  isQA: PropTypes.bool,
  currentStep: PropTypes.number.isRequired,
  currentComponent: PropTypes.any,
  setFlow: PropTypes.func.isRequired,
  showOnfidoLogo: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  fieldValues: getFormValues(state),
  isDisabled: getIsDisabled(state),
  currentStep: getStep(state),
  sdkFlow: getFlow(state),
  currentComponent: getCurrentComponent(state),
});

Widget.contextType = TranslationsContext;

export default connect(
  mapStateToProps,
  actions,
)(withStyles(widgetStyles)(Widget));
