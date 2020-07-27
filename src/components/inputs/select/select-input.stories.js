import React from 'react';
import Select from './index';

export default { title: 'Inputs|Select Input' };

const options = [
  {
    name: 'Test',
    value: 'Test',
  },
  {
    name: 'Test 1',
    value: 'Test 1',
  },
  {
    name: 'Test 2',
    value: 'Test 2',
  },
  {
    name: 'Test 3',
    value: 'Test 3',
  },
];

export const SelectInput = () => <Select options={options} name="Test" placeholder="Select option" />;
