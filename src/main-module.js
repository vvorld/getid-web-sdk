import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import retargetEvents from 'react-shadow-dom-retarget-events';
import TranslationsContext from './context/TranslationsContext';
import Widget from './layouts/widget';
import style from './layouts/style.css';
import En from '~/translations/default';
import Ru from '~/translations/ru';

const mapContext = {
  en: En,
  ru: Ru,
};

const MainModule = (widgetOptions, component) => {
  const { HtmlProperties, isLanguageSwitch } = widgetOptions;

  const attachShadow = (ref) => {
    if (!ref) return;
    const shadowRoot = ref.attachShadow({ mode: 'open' });
    window.GetIDShadowRoot = shadowRoot;
    retargetEvents(shadowRoot);
    [].slice.call(ref.children).forEach((child) => {
      shadowRoot.appendChild(child);
    });
  };

  const Main = () => {
    const [ctx, setCxt] = useState(widgetOptions.translations);
    const setContext = () => {
      const { value } = document.getElementById('language-switch');
      setCxt(mapContext[value] || widgetOptions.translations);
    };
    return (
      <>
        <style>
          {style}
        </style>
        {isLanguageSwitch && (
          <div>
            <select id="language-switch" onChange={setContext}>
              <option value="en">en</option>
              <option value="ru">ru</option>
              <option value="nl">nl</option>
            </select>
          </div>
        )}
        <TranslationsContext.Provider
          value={{ translations: ctx }}
        >
          {component}
        </TranslationsContext.Provider>
      </>
    );
  };

  if (HtmlProperties && HtmlProperties.isShadowDom) {
    return (
      <div ref={attachShadow}><Main /></div>
    );
  }

  return (
    <Main />
  );
};

/**
 * Renders main widget component
 * @param widgetOptions
 */
export const renderMainComponent = (widgetOptions) => {
  const container = document.getElementById(widgetOptions.containerId);

  if (container.hasChildNodes()) {
    ReactDOM.unmountComponentAtNode(container);
  }

  ReactDOM.render(MainModule(widgetOptions, <Widget {...widgetOptions} />), container);
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
