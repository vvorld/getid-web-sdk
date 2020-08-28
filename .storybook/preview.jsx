import React from 'react';
import '../src/layouts/style.css';
import { addDecorator } from '@storybook/react';
import TranslationsContext from '../src/context/TranslationsContext';
import translations from '../src/translations/default.js';

const Context = (storyFn) => (
  <TranslationsContext.Provider value={{ translations }}>
    <div id="getid-main">
      {storyFn()}
    </div>
  </TranslationsContext.Provider>
);

addDecorator(Context);

export default Context;
