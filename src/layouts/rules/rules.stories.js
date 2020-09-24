import React from 'react';

import Rules from './index';

export default { title: 'Layouts|Rules' };

export const RulesView = () => (
  <main id="getid" data-role="container">
    <div className="getid-grid__main">
      <Rules rules="Photo" className="getid-button__wrapper" />
    </div>
  </main>
);
