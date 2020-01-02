import ReactDOM from 'react-dom';
import React from 'react';
import { Provider } from 'react-redux';
import Widget from './layouts/Widget';
import './assets/styles/index.scss';

import store from './store/store';
import apiProvider from './services/api';

const supportedBrowsers = require('../supportedBrowsers');

if (!supportedBrowsers.test(navigator.userAgent)) {
  console.error('Your browser is not supported.');
}

const MainModule = (widgetOptions) => (
  <Provider store={store}>
    <Widget
      {...widgetOptions}
    />
  </Provider>
);

/**
 * Renders main widget component
 * @param widgetOptions
 */
const renderComponent = (widgetOptions) => {
  if (widgetOptions.containerId) {
    ReactDOM.render(MainModule(widgetOptions), document.getElementById(widgetOptions.containerId));
  }
};

/**
 * Init. Checks for token => returns the widget.
 * @param options
 */
export const init = (options) => {
  apiProvider.verifyJWT(options.jwtToken, options.apiUrl).then((res) => res.json()).then((data) => {
    if (data.responseCode !== 200) {
      console.log(`Error: ${data.errorMessage}`);
      return;
    }
    renderComponent(options);
  });
};
