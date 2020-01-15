import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import store from '../store/store';
import Loader from '../components/Loader/Loader';
import { mapUserData } from '../helpers/tree-builder';
import UpperPart from './UpperPart';
import actions from '../store/actions';
import apiProvider from '../services/api';
import Footer from '../components/Footer';
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

    apiProvider.submitData(mapUserData(store.getState()), jwtToken, apiUrl).then((res) => {
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

  getType = () => this.isThankYouPage() && 'noIcon';

  buttonAction = () => {
    if (this.isThankYouPage()) {
      return this.props.onComplete;
    }

    return this.isButtonToSubmitData() ? this.submitData : this.triggerNextComponent;
  };

  buttonText = () => {
    if (this.isThankYouPage()) return 'start over';
    return this.isButtonToSubmitData() ? 'SUBMIT' : 'NEXT';
  };

  resetFormConfig = () => ({
    cancel: {
      name: 'Cancel',
      action: this.props.onFail,
      class: 'prevButton',
    },
    retry: {
      name: 'Retry',
      action: this.submitData,
      class: 'isGradient',
    },
    chooseFlow: {
      name: 'Choose Flow',
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

  render() {
    const {
      fields,
      classes,
      formType,
      apiUrl,
      currentStep,
      setDisabled,
      fieldValues,
      isQA,
      flow,
      documentData,
      showOnfidoLogo,
    } = this.props;

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
            <ResetView buttonConfig={this.resetFormConfig()} />
          </Grid>
        </Grid>
      );
    }

    if (!this.CurrentComponent()) return null;

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

    // TODO: move to function
    const footer = {
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

    const LoadingComponent = this.CurrentComponent();
    const { idCapturebackIndex } = this;

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
          <LoadingComponent.component {...(this.isForm() ? {
            currentStep,
            fields,
            footer,
            formType,
            apiUrl,
          } : {
            currentStep,
            apiUrl,
            footer,
            isQA,
            flow,
            idCapturebackIndex,
            documentData,
            showOnfidoLogo,
          })}
          />
          {!this.isCameraView() && <Footer {...footer} />}
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


export default connect(
  mapStateToProps,
  actions,
)(withStyles(widgetStyles)(Widget));
