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

/**
 * Renders main widget component
 * @param widgetOptions
 */
export const renderMainComponent = (widgetOptions) => {
  const container = document.getElementById(widgetOptions.containerId);
  const component = MainModule(widgetOptions);
  if (container.hasChildNodes()) {
    ReactDOM.unmountComponentAtNode(container);
  }

  ReactDOM.render(component, container);
};
