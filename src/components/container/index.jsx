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
  const { translations, styles, htmlProperties } = config;
  const stylesRef = (ref) => Object.entries(styles || {}).forEach((st) => {
    if (!ref) return;
    ref.style.setProperty(st[0], st[1], 'important');
  });
  const [switchMode, setSwitchMode] = useState(false);
  const switchDevice = () => setSwitchMode(true);
  const renderGetID = () => (
    <TranslationsContext.Provider value={{ translations, switchDevice }}>
      <main ref={stylesRef} id="getid-main" data-role="container">
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
  if (htmlProperties && htmlProperties.isShadowDom) {
    return (
      <div ref={attachShadow}>
        {renderGetID()}
      </div>
    );
  }

  return renderGetID();
};
