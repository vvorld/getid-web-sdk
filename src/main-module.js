import React from 'react';
import ReactDOM from 'react-dom';
// TODO import root from 'react-shadow';

import TranslationsContext from './context/TranslationsContext';
import Widget from './layouts/widget';

/* </root.div>
<root.div>
 */
const MainModule = (widgetOptions) => (
  <div>
    <TranslationsContext.Provider
      value={{ translations: widgetOptions.translations }}
    >
      <Widget {...widgetOptions} />
    </TranslationsContext.Provider>
  </div>

);

const validateFlow = (flow) => true;
const enableThankYou = (flow) => true;
/**
 * Renders main widget component
 * @param widgetOptions
 */
export const renderMainComponent = (widgetOptions) => {
  const copy = { ...widgetOptions };
  const { flow } = copy;
  validateFlow(flow);
  if (enableThankYou(flow)) {
    copy.flow = [...copy.flow.slice(0, -1), { component: 'Sending' }, copy.flow.pop()];
  } else {
    copy.flow = [...copy.flow, { Component: 'Sending' }];
  }
  const container = document.getElementById(copy.containerId);
  const component = MainModule(copy);
  if (container.hasChildNodes()) {
    ReactDOM.unmountComponentAtNode(container);
  }

  ReactDOM.render(component, container);
};
