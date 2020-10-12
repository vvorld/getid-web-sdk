import React, { useState } from 'react';
import retargetEvents from 'react-shadow-dom-retarget-events';

import TranslationsContext from '~/context/TranslationsContext';
import Landscape from '~/assets/icons/views/landscape.svg';
import Translate from '~/components/blocks/translations';
import style from '~/layouts/style.css';
import ChangeDevice from '~/components/change-device';

const attachShadow = (ref) => {
  if (!ref) return;
  const shadowRoot = ref.attachShadow({ mode: 'open' });
  retargetEvents(shadowRoot);
  [].slice.call(ref.children).forEach((child) => {
    shadowRoot.appendChild(child);
  });
};

export default ({
  children, ...config
}) => {
  const [show, setShow] = useState(false);
  const { translations, styles, htmlProperties } = config;
  const stylesRef = (ref) => Object.entries(styles || {}).forEach((st) => {
    if (!ref) return;
    ref.style.setProperty(st[0], st[1], 'important');
  });
  const [switchMode, setSwitchMode] = useState(false);
  const switchDevice = () => setSwitchMode(true);
  const renderGetID = () => (
    <TranslationsContext.Provider value={{ translations, switchDevice }}>
      <main ref={stylesRef} id="getid-main" className={htmlProperties.isPopUp ? 'getid-popup' : ''} data-role="container">
        <style>{style}</style>
        <div className="getid-landscape_message">
          <img
            src={Landscape}
            alt="mobile landscape"
            data-role="mobile-landscape"
          />
          <div className="getid-header__small">
            <Translate step="mobileCamera" element="landscape" />
          </div>
        </div>

        <div className="getid-grid__main">
          {!switchMode
            ? children
            : (
              <ChangeDevice
                config={config}
                onBack={() => setSwitchMode(false)}
              />
            )}
        </div>
      </main>
    </TranslationsContext.Provider>
  );

  const sd = (
    <div ref={attachShadow}>
      {renderGetID()}
    </div>
  );

  if (htmlProperties && htmlProperties.isPopUp) {
    return (
      <TranslationsContext.Provider value={{ translations, switchDevice }}>
        <style>{style}</style>
        <div id="getid-popup__main">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShow(true);
            }}
            className="getid-popup__open-button getid-button__main getid-violet"
          >
            <Translate step="openPopUp" element="button" />
          </button>
          {show && (
            <div
              role="button"
              tabIndex="0"
              onClick={(e) => {
                e.stopPropagation();
                setShow(false);
              }}
              id="getid-popup-window-main"
              className="getid-popup__container"
            >
              <div
                role="button"
                tabIndex="0"
                onClick={(e) => {
                  e.stopPropagation();
                }}
                className="getid-container__popup"
                data-role="container"
              >
                <button
                  className="getid-popup__close-button"
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShow(false);
                  }}
                >
                  <Translate step="closePopUp" element="button" />
                  <div className="getid-close" />
                </button>
                {htmlProperties.isShadowDom ? sd : renderGetID()}
              </div>
            </div>
          )}
        </div>
      </TranslationsContext.Provider>
    );
  }

  if (htmlProperties && htmlProperties.isShadowDom) {
    return sd;
  }

  return renderGetID();
};
