import React from 'react';
import Input from './index';

export default { title: 'Inputs|Text Input' };

export const regularInput = () => <Input name="Test" placeholder="Test" label="Test" />;
export const requiredInput = () => <Input name="Test" placeholder="Test" label="Test" required />;
