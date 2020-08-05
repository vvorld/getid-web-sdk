import React from 'react';
import '../src/layouts/style.css';
import { addDecorator } from '@storybook/react';
import TranslationsContext from '../src/context/TranslationsContext';
import translations from '../src/translations/default.json';

const Context = (storyFn) => (
  <TranslationsContext.Provider value={{ translations }}>
    {storyFn()}
  </TranslationsContext.Provider>
);

addDecorator(Context);

export default Context;
