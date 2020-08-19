import React from 'react';
import ReactDOM from 'react-dom';

import TranslationsContext from './context/TranslationsContext';
import Widget from './layouts/widget';

const MainModule = (widgetOptions, component) => (
  <div>
    <TranslationsContext.Provider
      value={{ translations: widgetOptions.translations }}
    >
      {component}
    </TranslationsContext.Provider>
  </div>
);

/**
 * Renders main widget component
 * @param widgetOptions
 */
export const renderMainComponent = (widgetOptions) => {
  const container = document.getElementById(widgetOptions.containerId);
  const component = MainModule(widgetOptions, <Widget {...widgetOptions} />);
  if (container.hasChildNodes()) {
    ReactDOM.unmountComponentAtNode(container);
  }

  ReactDOM.render(component, container);
};

/**
 * Renders additional components
 * @param widgetOptions
 * @param component
 */
export const renderComponent = (widgetOptions, component) => {
  const container = document.getElementById(widgetOptions.containerId);
  const componentView = MainModule(widgetOptions, component);
  ReactDOM.render(componentView, container);
};
