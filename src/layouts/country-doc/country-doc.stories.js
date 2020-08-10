import React from 'react';
import { setCss } from '../../helpers/generic';
import { darkTheme } from '../../dark-theme';
import CountryAndDocument from './index';

export default { title: 'Layouts|CountryDocument' };

setCss(darkTheme);

const docs = {
  ee: {
    name: 'Estonia',
    documents: [
      { name: 'driving-licence', composition: 'front-back' },
      { name: 'passport', composition: 'single' },
      { name: 'residence-permit', composition: 'front-back' },
    ],
  },
};

export const CountryDocument = () => (
  <main id="getid" data-role="container">
    <div className="getid-grid__main">
      <CountryAndDocument countryDocuments={docs} className="getid-button__wrapper" />
    </div>
  </main>
);
