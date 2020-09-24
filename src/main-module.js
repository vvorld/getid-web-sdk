import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import retargetEvents from 'react-shadow-dom-retarget-events';
import TranslationsContext from './context/TranslationsContext';
import Widget from './layouts/widget';
import style from './layouts/style.css';

const MainModule = (widgetOptions, component) => {
  const { HtmlProperties } = widgetOptions;

  const attachShadow = (ref) => {
    if (!ref) return;
    const shadowRoot = ref.attachShadow({ mode: 'open' });
    retargetEvents(shadowRoot);
    [].slice.call(ref.children).forEach((child) => {
      shadowRoot.appendChild(child);
    });
  };

  const Main = () => (
    <>
      <style>
        {style}
      </style>
      <TranslationsContext.Provider
        value={{ translations: widgetOptions.translations }}
      >
        {component}
      </TranslationsContext.Provider>
    </>
  );

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
