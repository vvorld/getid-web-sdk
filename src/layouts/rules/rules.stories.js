import React from 'react';
import { setCss } from '../../helpers/generic';
import { darkTheme } from '../../dark-theme';

import Rules from './index';

export default { title: 'Layouts|Rules' };

setCss(darkTheme);

export const RulesView = () => (
  <main id="getid" data-role="container">
    <div className="getid-grid__main">
      <Rules rules="Photo" className="getid-button__wrapper" />
    </div>
  </main>
);
