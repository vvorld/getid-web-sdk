import { ThemeProvider, StylesProvider, jssPreset } from '@material-ui/styles';
import { create } from 'jss';
import { Provider } from 'react-redux';
import React from 'react';
import ReactDOM from 'react-dom';
import Frame, { FrameContextConsumer } from 'react-frame-component';
import MainTheme from './theme';
import store from './store/store';
import TranslationsContext from './context/TranslationsContext';
import Main from './layouts/Main';

const initialContent = '<!DOCTYPE html><html><head></head><body style="margin: 0; overflow-x: hidden"><div></div></body></html>';

const MainModule = (widgetOptions) => (
  <Frame frameBorder={0} style={{ width: '100%', height: '99vh' }} initialContent={initialContent}>
    <FrameContextConsumer>
      {
        ({ document }) => {
          const jss = create({
            plugins: [...jssPreset().plugins],
            insertionPoint: document.head,
          });
          return (
            <StylesProvider jss={jss}>
              <ThemeProvider theme={MainTheme}>
                <Provider store={store}>
                  <TranslationsContext.Provider
                    value={{ translations: widgetOptions.translations }}
                  >
                    <Main
                      {...widgetOptions}
                    />
                  </TranslationsContext.Provider>
                </Provider>
              </ThemeProvider>
            </StylesProvider>
          );
        }
      }
    </FrameContextConsumer>
  </Frame>
);

/**
 * Renders main widget component
 * @param widgetOptions
 */
export const renderMainComponent = (widgetOptions) => {
  ReactDOM.render(MainModule(widgetOptions), document.getElementById(widgetOptions.containerId));
};
