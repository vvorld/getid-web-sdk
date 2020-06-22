import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import root from 'react-shadow';
import store from './store/store';
import actions from './store/actions';

import TranslationsContext from './context/TranslationsContext';
import Main from './layouts/Main';
import ErrorBoundary from './layouts/ErrorBoundary';



const MainModule = (widgetOptions) => (
  <root.div>
    <div>
        <Provider store={store}>
          <TranslationsContext.Provider
            value={{ translations: widgetOptions.translations }}
          >
            <ErrorBoundary>
              <Main
                {...widgetOptions}
              />
            </ErrorBoundary>
          </TranslationsContext.Provider>
        </Provider>
    </div>
  </root.div>
);

/**
 * Renders main widget component
 * @param widgetOptions
 */
export const renderMainComponent = (widgetOptions) => {
  const container = document.getElementById(widgetOptions.containerId);
  const component = MainModule(widgetOptions, store);

  if (container.hasChildNodes()) {
    store.dispatch(actions.resetStore());
    ReactDOM.unmountComponentAtNode(container);
  }

  ReactDOM.render(component, container);
};
