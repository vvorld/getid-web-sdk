import React from 'react';
import { setCss } from '~/helpers/generic';
import { darkTheme } from '~/dark-theme';

import Form from './index';

export default { title: 'Layouts|Form' };

setCss(darkTheme);

const fields = [
  {
    label: 'Last Name',
    type: 'text',
    name: 'Last name',
    value: 'Gerus',
    required: true,
  },
  {
    label: 'Date Of Birth',
    type: 'date',
    name: 'Date of Birth',
    value: '1986-09-22',
    // required: true,
  },
];

export const FormView = () => (
  <main id="getid" data-role="container">
    <div className="getid-grid__main">
      <Form fields={fields} className="getid-button__wrapper" />
    </div>
  </main>
);
