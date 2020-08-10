import React, { Component } from 'react';

import Form from './form';
import ThankYou from './thank-you';
import CountryAndDocument from './country-doc';
import Sending from './sending';
import {
  CaptureBack,
  DocumentPhoto,
  Video,
  Selfie,
} from './webcam';

import Rules from './rules';

import './style.css';

const transformAppToApiModel = (app, api, metadata) => async () => {
  const data = {
    application: { metadata: metadata || {} },
  };
  if (app.form) {
    data.application.fields = Object.entries(app.form || {})
      .map(([key, v]) => ({ category: key, content: v.value, contentType: v.contentType }));
  } else {
    data.application.fields = [];
  }
  if (app.front) {
    data.application.documents = [{
      issuingCountry: app.country,
      documentType: app.documentType,
      images: [],
    }];
  } else {
    data.application.documents = [];
  }
  if (app.selfie) {
    data.application.faces = [{ category: 'selfie', content: [] }];
  } else {
    data.application.faces = [];
  }
  const files = {
    front: app.front,
    back: app.back,
    selfie: app.selfie,
  };
  await api.trySendEvent('loading', 'started');
  const result = await api.submitData(data, files);
  await api.trySendEvent('loading', 'completed');
  await api.trySendEvent('thank-you', 'completed');
  return result;
};

const validateFlow = (flow) =>
  // warning CountryAndDocument
  true;

const enableThankYou = (flow) => true;

const normaliseFlow = (flow) => {
  validateFlow(flow);
  if (enableThankYou(flow)) {
    flow = [...flow.slice(0, -1), { component: 'Sending' }, flow.pop()];
  } else {
    flow = [...flow, { Component: 'Sending' }];
  }

  const documentIndex = flow.findIndex((x) => x.component === 'DocumentPhoto');
  const app = {};
  if (documentIndex !== -1) {
    const dockStep = flow[documentIndex];
    if (dockStep.showRules) {
      flow.splice(documentIndex, 0, {
        component: 'Rules',
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
        const docPhoto = flow[documentIndex];
        const newFlow = [...flow];
        newFlow.splice(documentIndex + 1, 0, { ...docPhoto, component: 'CaptureBack' });
        this.flow = newFlow;
      }
    } else {
      this.flow = flow.filter((x) => x.component !== 'CaptureBack');
    }
  }

  checkDocumentPhoto = async (front, back) => {
    const res = await this.props.api.checkSide(front, back);
    this.checkDocumentType(res.documentType);
    if (res.extractedData) {
      this.state.app.extractedData = res.extractedData;
    }
    if (res.documentType === 'unknown') {
      return { result: false, message: 'Document was not readed' };
    }
    return { result: true };
  };

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
    const app = {
      ...this.state.app,
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

  finish = (delta) => {
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
        (props) => <Form form={app.form} additionalData={app.additionalData} extractedData={app.extractedData} {...props} />,
        (form) => next({ form }, 'form'),
      ];
      case 'Rules': return (app, next) => [
        (props) => <Rules {...props} />,
        () => next({ }),
      ];
      case 'CaptureBack': return (app, next) => [
        (props) => (
          <CaptureBack
            front={app.front}
            blob={app.back}
            {...props}
            direction={this.state.direction}
            checkDocumentPhoto={(back) => this.checkDocumentPhoto(app.front, back)}
          />
        ),
        (back) => next({ back }, 'back'),
      ];
      case 'DocumentPhoto': return (app, next) => [
        (props) => (
          <DocumentPhoto
            blob={app.front}
            {...props}
            direction={this.state.direction}
            checkDocumentPhoto={(front) => this.checkDocumentPhoto(front)}
          />
        ),
        (front) => next({ front }, 'front'),
      ];
      case 'Selfie': return (app, next) => [
        (props) => <Selfie blob={app.selfie} {...props} />,
        (selfie) => next({ selfie }, 'selfie'),
      ];
      case 'Video': return (app, next) => [
        (props) => <Video {...props} />,
        (selfie) => next({ selfie }, 'video'),
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
      default: throw new Error(`Unexpected step: '${name}'`);
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
    const nextStep = step < flow.length - 1 ? this.nextStep : this.finish;
    const [CurrentComponent, finishStep] = this.getComponent(componentName)(app, nextStep);
    const prevStep = step > 0 ? this.prevStep : this.props.onBack;

    return (
      <main id="getid" data-role="container">
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

export default Widget;
