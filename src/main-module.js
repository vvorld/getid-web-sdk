import { ThemeProvider } from '@material-ui/styles';
import { Provider } from 'react-redux';
import React from 'react';
import ReactDOM from 'react-dom';
import MainTheme from './theme';
import store from './store/store';
import TranslationsContext from './context/TranslationsContext';
import Main from './layouts/Main';
import ErrorBoundary from './layouts/ErrorBoundary';

const MainModule = (widgetOptions) => (
  <ThemeProvider theme={MainTheme}>
    <Provider store={store}>
      <TranslationsContext.Provider value={{ translations: widgetOptions.translations }}>
        <ErrorBoundary>
          <Main
            {...widgetOptions}
          />
        </ErrorBoundary>
      </TranslationsContext.Provider>
    </Provider>
  </ThemeProvider>
);

/**
 * Renders main widget component
 * @param widgetOptions
 */
export const renderMainComponent = (widgetOptions) => {
  ReactDOM.render(MainModule(widgetOptions), document.getElementById(widgetOptions.containerId));
};
