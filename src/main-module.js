import { create } from 'jss';
import camelCase from 'jss-plugin-camel-case';
import { ThemeProvider } from '@material-ui/styles';
import { StylesProvider, jssPreset } from '@material-ui/core/styles';
import { Provider } from 'react-redux';
import React from 'react';
import ReactDOM from 'react-dom';
import MainTheme from './theme';
import store from './store/store';
import TranslationsContext from './context/TranslationsContext';
import Main from './layouts/Main';
import ErrorBoundary from './layouts/ErrorBoundary';

// const generateClassName = createGenerateClassName({
//   productionPrefix: 'get-id',
// });

const styleNode = document.createComment('jss-insertion-point');
document.head.insertBefore(styleNode, document.head.firstChild);

const jss = create({
  ...jssPreset(),
  insertionPoint: 'jss-insertion-point',
});

console.log('JSS:');
console.dir(jss);

jss.use(camelCase());

const MainModule = (widgetOptions) => (
  <StylesProvider jss={jss}>
    <ThemeProvider theme={MainTheme}>
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
    </ThemeProvider>
  </StylesProvider>
);

/**
 * Renders main widget component
 * @param widgetOptions
 */
export const renderMainComponent = (widgetOptions) => {
  const container = document.getElementById(widgetOptions.containerId);
  const component = MainModule(widgetOptions);

  if (container.hasChildNodes()) ReactDOM.unmountComponentAtNode(container);

  ReactDOM.render(component, container);
};
