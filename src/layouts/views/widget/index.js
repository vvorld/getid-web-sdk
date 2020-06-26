import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Grid } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import Loader from '../../../components/loader/loader';
import Header from '../../../components/blocks/header/header';
import actions from '../../../store/actions';
import Footer from '../../../components/blocks/footer/footer';
import TranslationsContext from '../../../context/TranslationsContext';
import { stepNames } from '../../../constants/step-names';
import widgetStyles from './style';
import allComponents from '../index';
import BackIcon from '../../../assets/icons/views/arrow-back.svg';
import { AppExistsView, FailError } from '../error';
import { promiseTimeout, getEventStepName, isCameraView } from '../../../helpers/generic';

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
        attempts: 3,
        width: 12,
        direction: 'center',
        action: this.buttonAction(),
        text: this.nextButtonText(),
        variant: 'contained',
        disabled: isDisabled,
        type: this.getType(),
      },
      back: {
        direction: 'left',
        hidden: (currentComponent.order === 0 || this.isPage('ThankYou')) || flow.length === 1,
        action: this.triggerPreviousComponent,
        type: 'back',
        variant: 'outlined',
        iconItem: BackIcon,
        text: translations.button_back,
      },
      retake: {
        direction: 'right',
        type: 'retake',
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

    const { classes, ...other } = this.props;

    const {
      loading, largeGrid, smallGrid, appExists, responseCode, submitAttempts,
    } = this.state;

    if (loading) {
      return (
        <div className={classes.loader}>
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

    if (!currentComponent) return null;
    const { length } = currentComponent.component;

    return (
      <Grid container className={classes.root} justify="center" alignItems="center" data-role="container">
        <Grid item xs={12} className={classes.item}>
          <Header currentComponent={currentComponent} />
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
        <Grid item xs={12} sm={9} lg={6} className={classes.item}>
          {!isCameraView(currentComponent) && <Footer {...this.footer()} />}
        </Grid>
      </Grid>
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
)(withStyles(widgetStyles)(Widget));
