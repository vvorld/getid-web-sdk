import React from 'react';
import { darkTheme } from '../../dark-theme';

import ThankYou from './index';

export default { title: 'Layouts|ThankYou' };

export const ThankYouView = () => (
  <main id="getid" data-role="container">
    <div className="getid-grid__main">
      <ThankYou className="getid-button__wrapper" />
    </div>
  </main>
);
