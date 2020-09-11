import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Form from './form';
import ThankYou from './thank-you';
import CountryAndDocument from './country-doc';
import Sending from './sending';
import {
  CaptureBack,
  DocumentPhoto,
  Record,
  Selfie,
  Liveness,
} from './webcam';

import Rules from './rules';

import './style.css';

const transformAppToApiModel = (app, api, metadata) => async () => {
  const data = {
    application: { metadata: metadata || {} },
  };
  const files = {
    front: app.front,
    back: app.back,
    selfie: app.selfie,
    'selfie-video': app.selfieVideo,
  };
  if (app.form) {
    data.application.fields = Object.entries(app.form || {}).filter(([key, v]) => {
      if (v.value && v.value.type) {
        files[key] = v.value;
        return false;
      }
      return true;
    }).map(([key, v]) => ({ category: key, content: v.value, contentType: v.contentType }));
  } else {
    data.application.fields = [];
  }
  if (app.front || files.front) {
    data.application.documents = [{
      issuingCountry: app.country,
      documentType: app.documentType,
      images: [],
    }];
  } else {
    data.application.documents = [];
  }
  data.application.faces = [];
  if (app.selfie) {
    data.application.faces.push({ category: 'selfie', content: [] });
  }
  if (app.selfieVideo) {
    data.application.faces.push({ category: 'selfie-video', content: [] });
  }

  await api.trySendEvent('loading', 'started');
  const result = await api.submitData(data, files);
  await api.trySendEvent('loading', 'completed');
  await api.trySendEvent('thank-you', 'completed');
  return result;
};
// warning CountryAndDocument

const validateFlow = (flow) => {
  const ty = flow.findIndex((x) => x.component === 'ThankYou');
  if (ty >= 0 && ty < flow.length - 1) {
    throw new Error('ThankYou must be last component');
  }
};

const enableThankYou = (flow) => flow.find((x) => x.component === 'ThankYou');

const normaliseFlow = (flow) => {
  validateFlow(flow);

  const documentIndex = flow.findIndex((x) => x.component === 'DocumentPhoto');
  const app = {};
  if (documentIndex !== -1) {
    const dockStep = flow[documentIndex];
    if (dockStep.showRules) {
      flow.splice(documentIndex, 0, {
        component: 'PhotoRules',
      });
    }
    if (dockStep.interactive) {
      flow.splice(documentIndex, 0, {
        component: 'CountryAndDocument',
      });
      app.country = dockStep.country;
      app.documentType = dockStep.documentType;
    }
  }

  const selfieIndex = flow.findIndex((x) => x.component === 'Selfie');
  if (selfieIndex !== -1) {
    const selfieStep = flow[selfieIndex];
    if (selfieStep.showRules) {
      flow.splice(selfieIndex, 0, {
        component: 'SelfieRules',
      });
    }
  }
  if (enableThankYou(flow)) {
    // eslint-disable-next-line no-param-reassign
    flow = [...flow.slice(0, -1), { component: 'Sending' }, flow.pop()];
  } else {
    // eslint-disable-next-line no-param-reassign
    flow = [...flow, { component: 'Sending' }];
  }
  return [flow, app];
};
class Widget extends Component {
  constructor(props) {
    super(props);
    const [flow, app] = normaliseFlow(props.flow);
    app.additionalData = props.additionalData;
    app.extractedData = [];
    this.state = {
      step: 0,
      direction: 'forward',
      app,
    };
    this.flow = flow;
  }

  setEnableBack = (enable) => {
    const { flow } = this;
    if (enable) {
      const step = flow.find((x) => x.component === 'CaptureBack');
      if (step) {
        return;
      }
      const documentIndex = flow.findIndex((x) => x.component === 'DocumentPhoto');
      if (documentIndex !== -1) {
        const nn = documentIndex > this.state.step ? documentIndex : this.state.step;
        const docPhoto = flow[nn];
        const newFlow = [...flow];
        newFlow.splice(nn + 1, 0, { ...docPhoto, component: 'CaptureBack' });
        this.flow = newFlow;
      }
    } else {
      this.flow = flow.filter((x) => x.component !== 'CaptureBack');
    }
  }

  checkDocumentPhoto = async ({ front, back }, tryNumber, limit) => {
    const res = await this.props.api.checkSide(front, back);
    const documentIndex = this.flow.findIndex((x) => x.component === 'DocumentPhoto');
    if (!this.flow[documentIndex].interactive) {
      await this.checkDocumentType(res.documentType);
    }
    if (res.extractedData) {
      this.state.app.extractedData = res.extractedData;
    }
    if (res.documentType === 'unknown') {
      if (tryNumber >= limit) {
        if (!this.state.app.documentType) {
          this.flow.splice(this.state.step + 1, 0, {
            component: 'CountryAndDocument',
          });
        }
        return { result: true, code: 'unknown' };
      }
      return { result: false, code: 'unknown' };
    }

    if (front && (res.documentSidesConclusion === 'front-side-missing' && this.state.app.documentType !== 'passport')) {
      return { result: false, code: 'front_side_missing' };
    }

    if (back && (res.documentSidesConclusion === 'back-side-missing' && this.state.app.documentType !== 'passport')) {
      return { result: false, code: 'back_side_missing' };
    }

    return { result: true };
  };

  checkSelfiePhoto = async ({ selfie }) => {
    try {
      const res = await this.props.api.checkSelfie(selfie);
      return { result: res.found, code: res.found === false && 'selfie_unknown' };
    } catch (e) {
      console.error(e);
      return { result: false, code: 'selfie_error' };
    }
  }

  checkDocumentType = async (documentType) => {
    switch (documentType) {
      case 'passport':
        this.setEnableBack(false);
        break;
      case 'id-card':
      case 'residence-permit':
      case 'driving-licence':
        this.setEnableBack(true);
        break;
      default:
    }
  };

  nextStep = async (delta, stepName) => {
    if (this.state.step >= this.flow.length - 1) {
      this.finish();
      return;
    }
    const a = this.state.app;
    const app = {
      ...a,
      ...delta,
    };

    if (delta.documentType) {
      await this.checkDocumentType(delta.documentType);
    }

    if (stepName) {
      await this.props.api.trySendEvent(stepName, 'completed');
    }

    const { step } = this.state;
    this.setState({
      step: step + 1,
      direction: 'forward',
      app,
    });
  }

  prevStep = () => {
    const { step } = this.state;
    this.setState({
      step: step - 1,
      direction: 'back',
    });
  }

  finish = () => {
    if (this.onComplete) {
      // TODO add data from server
      this.onComplete();
    }
  }

  setResult = (result) => {
    if (this.props.onComplete) {
      this.onComplete = () => this.props.onComplete(result);
    }
  }

  getComponent = (name) => {
    switch (name) {
      case 'Form': return (app, next) => [
        (props) => (
          <Form
            form={app.form}
            additionalData={app.additionalData}
            extractedData={app.extractedData}
            {...props}
          />
        ),
        (form) => next({ form: { ...app.form || {}, ...form } }, 'form'),
      ];
      case 'PhotoRules': return (app, next) => [
        (props) => <Rules step="PhotoRules" {...props} />,
        () => next({ }),
      ];
      case 'SelfieRules': return (app, next) => [
        (props) => <Rules step="SelfieRules" {...props} />,
        () => next({ }),
      ];
      case 'CaptureBack': return (app, next) => [
        (props) => (
          <CaptureBack
            front={app.front}
            blob={app.back}
            {...props}
            styles={this.props.styles}
            direction={this.state.direction}
            checkDocumentPhoto={(
              back, tryNumber,
            ) => this.checkDocumentPhoto({ front: app.front, back }, tryNumber, 3)}
          />
        ),
        (back) => next({ back }, 'back'),
      ];
      case 'DocumentPhoto': return (app, next) => [
        (props) => (
          <DocumentPhoto
            blob={app.front}
            {...props}
            styles={this.props.styles}
            direction={this.state.direction}
            checkDocumentPhoto={(
              front, tryNumber,
            ) => this.checkDocumentPhoto({ front }, tryNumber, 3)}
          />
        ),
        (front) => next({ front }, 'front'),
      ];
      case 'Selfie': return (app, next) => [
        (props) => (
          <Selfie
            styles={this.props.styles}
            blob={app.selfie}
            direction={this.state.direction}
            checkSelfiePhoto={(selfie) => this.checkSelfiePhoto({ selfie })}
            {...props}
          />
        ),
        (selfie) => next({ selfie }, 'selfie'),
      ];
      case 'Record': return (app, next) => [
        (props) => (
          <Record
            server={this.props.webRtcServerUrl}
            direction={this.state.direction}
            blob={app.selfieVideo}
            styles={this.props.styles}
            {...props}
          />
        ),
        (selfieVideo) => next({ selfieVideo }, 'record'),
      ];
      case 'Liveness': return (app, next) => [
        (props) => (
          <Liveness
            styles={this.props.styles}
            direction={this.state.direction}
            {...props}
          />
        ),
        () => next({ }, 'liveness'),
      ];
      case 'Sending': return (app, next) => [
        (props) => (
          <Sending
            send={transformAppToApiModel(app, this.props.api, this.props.metadata)}
            {...props}
          />
        ),
        (result) => {
          this.setResult(result);
          next({});
        },
      ];
      case 'ThankYou': return (app, next) => [
        (props) => <ThankYou {...props} />,
        () => next({}, 'thank-you'),
      ];
      case 'CountryAndDocument': return (app, next) => [
        (props) => (
          <CountryAndDocument
            country={app.country}
            documentType={app.documentType}
            countryDocuments={this.props.countryDocuments}
            {...props}
          />
        ),
        ({ country, documentType }) => next({ country, documentType }, 'country-and-document'),
      ];
      default:
        throw new Error(`Unexpected step: '${name}'`);
    }
  }

  render() {
    const { step, app } = this.state;
    const { flow } = this;
    const currentComponent = flow[step];
    if (!currentComponent) {
      return null;
    }
    const { component: componentName, ...componentProps } = currentComponent;
    const { nextStep } = this;
    const [CurrentComponent, finishStep] = this.getComponent(componentName)(app, nextStep);
    const prevStep = step > 0 ? this.prevStep : this.props.onBack;

    return (
      <main id="getid-main" data-role="container">
        <div className="getid-grid__main">
          <CurrentComponent
            finishStep={finishStep}
            prevStep={prevStep}
            {...componentProps}
          />
        </div>
      </main>
    );
  }
}

Widget.propTypes = {
  onBack: PropTypes.func,
  onComplete: PropTypes.func,
  countryDocuments: PropTypes.shape({}).isRequired,
  api: PropTypes.shape({
    trySendEvent: PropTypes.func.isRequired,
    checkSide: PropTypes.func.isRequired,
    checkSelfie: PropTypes.func.isRequired,
  }).isRequired,
  metadata: PropTypes.shape({}).isRequired,
  styles: PropTypes.shape({}),
  flow: PropTypes.array.isRequired,
  additionalData: PropTypes.array,
  webRtcServerUrl: PropTypes.string,
};
Widget.defaultProps = {
  onBack: null,
  styles: {},
  onComplete: null,
  additionalData: [],
  webRtcServerUrl: '',
};

export default Widget;
