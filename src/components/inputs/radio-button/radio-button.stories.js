import React from 'react';
import Radio from './index';

export default { title: 'Inputs|Radio Button' };

export const RadioButton = () => <Radio name="Test" placeholder="Test" value="Test" />;
export const RadioButtonChecked = () => <Radio checked name="Test" placeholder="Test" value="Test" />;
