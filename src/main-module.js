import { ThemeProvider, jssPreset, StylesProvider } from '@material-ui/styles';
import { Provider } from 'react-redux';
import React from 'react';
import ReactDOM from 'react-dom';
import { create } from 'jss';

import root from 'react-shadow';
import MainTheme from './theme';
import store from './store/store';
import TranslationsContext from './context/TranslationsContext';
import Main from './layouts/Main';
import ErrorBoundary from './layouts/ErrorBoundary';

class WrappedJssComponent extends React.Component {
  constructor(props) {
    super(props);
    this.containerRef = null;
    this.state = {
      jss: null,
    };
  }

  setRefAndCreateJss = (ref) => {
    if (ref && !this.state.jss) {
      const createdJssWithRef = create({ ...jssPreset(), insertionPoint: ref });
      this.containerRef = ref;
      this.setState({ jss: createdJssWithRef });
    }
  }

  render() {
    const { jss } = this.state;
    const { children } = this.props;
    return (
      <root.div>
        <div>
          <div id="123" ref={(ref) => this.setRefAndCreateJss(ref)}>
            {jss && (
            <StylesProvider jss={jss}>
              <ThemeProvider theme={MainTheme(() => this.containerRef)}>
                {children}
              </ThemeProvider>
            </StylesProvider>
            )}
          </div>
        </div>
      </root.div>
    );
  }
}

const MainModule = (widgetOptions) => (
  <div>
    <WrappedJssComponent>
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
    </WrappedJssComponent>
  </div>
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
