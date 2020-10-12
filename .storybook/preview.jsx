import React from 'react';
import { addDecorator } from '@storybook/react';
import TranslationsContext from '~/context/TranslationsContext';
import translations from '~/translations/default.js';

const Context = (storyFn) => (
  <TranslationsContext.Provider value={{ translations }}>
    <div id="getid-main">
      {storyFn()}
    </div>
  </TranslationsContext.Provider>
);

addDecorator(Context);

export default Context;
