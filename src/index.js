import ReactDOM from 'react-dom';
import React from 'react';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@material-ui/styles';
import Widget from './layouts/Widget';

import store from './store/store';
import apiProvider from './services/api';
import MainTheme from './assets/jss/MainTheme';

const supportedBrowsers = require('../supportedBrowsers');

if (!supportedBrowsers.test(navigator.userAgent)) {
  console.error('Your browser is not supported.');
}

const MainModule = (widgetOptions) => (
  <ThemeProvider theme={MainTheme}>
    <Provider store={store}>
      <Widget
        {...widgetOptions}
      />
    </Provider>
  </ThemeProvider>
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
    const { showOnfidoLogo } = data;
    renderComponent({ ...options, showOnfidoLogo });
  });
};
