import React, { Component } from 'react';

import Form from './form';
import ThankYou from './thank-you';
import CountryAndDocument from './country-doc';
import Sending from './sending';
import {
  Selfie as IdSelfie,
  CaptureBack,
  DocumentPhoto,
} from './webcam';

import Rules from './rules';

import './style.css';

const transformAppToApiModel = (app) => app;

const allComponents = {
  Form: (app, next) => [
    (props) => <Form form={app.form} {...props} />,
    (form) => next({ form }),
  ],
  Rules: (app, next) => [
    (props) => <Rules {...props} />,
    () => next({ }),
  ],
  CaptureBack: (app, next) => [
    (props) => <CaptureBack front={app.front} blob={app.back} {...props} />,
    (back) => next({ back }),
  ],
  DocumentPhoto: (app, next) => [
    (props) => (
      <DocumentPhoto
        blob={app.front}
        {...props}
      />
    ),
    (front) => {
      next({ front });
    },
  ],
  Selfie: (app, next) => [
    (props) => <IdSelfie blob={app.selfie} {...props} />,
    (selfie) => next({ selfie }),
  ],
  Sending: (app, next) => [
    (props) => <Sending data={transformAppToApiModel(app)} {...props} />,
    () => next({}),
  ],
  ThankYou: (app, next) => [
    (props) => <ThankYou {...props} />,
    () => next({}),
  ],
  CountryAndDocument: (app, next) => [
    (props) => (
      <CountryAndDocument
        country={app.country}
        documentType={app.documentType}
        {...props}
      />
    ),
    ({ country, documentType }) => next({ country, documentType }),
  ],
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
        const newFlow = [...flow];
        newFlow.splice(documentIndex + 1, 0, { component: 'CaptureBack' });
        this.flow = newFlow;
      }
    } else {
      this.flow = flow.filter((x) => x.component !== 'CaptureBack');
    }
  }

  checkDocumentPhoto = async (blob) => {
    const res = await this.props.api.checkSide(blob);
    this.checkDocumentType(res.documentType);
    if (res.documentType === 'unknown') {
      return { result: false, message: 'document not found' };
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

  nextStep = (delta) => {
    const app = {
      ...this.state.app,
      ...delta,
    };

    if (delta.documentType) {
      this.checkDocumentType(delta.documentType);
    }
    // await api.trySendEvent(stepName, 'completed');completed
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
    if (this.props.onComplete) {
      // TODO add data from server
      this.props.onComplete();
    }
  }

  render() {
    const { onBack } = this.props;
    const {
      step, direction, app,
    } = this.state;
    const { flow } = this;
    const currentComponent = flow[step];
    const { ...other } = this.props;
    if (!currentComponent) {
      return null;
    }
    const { component: componentName, ...componentProps } = currentComponent;

    const nextStep = step < flow.length - 1 ? this.nextStep : this.finish;
    const [CurrentComponent, finishStep] = allComponents[componentName](app, nextStep);
    const prevStep = step > 0 ? this.prevStep : onBack;
    return (
      <main id="getid" data-role="container">
        <div className="getid-grid__main">
          <CurrentComponent
            finishStep={finishStep}
            prevStep={prevStep}
            direction={direction}
            {...other}
            componentName={componentName}
            {...componentProps}
            setEnableBack={this.setEnableBack}
            checkDocumentPhoto={this.checkDocumentPhoto}
          />
        </div>
      </main>
    );
  }
}

export default Widget;
