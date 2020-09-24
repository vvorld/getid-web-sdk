import React from 'react';
import { action } from '@storybook/addon-actions';
import FileInput from './index';
import '~/layouts/form/form.css';

const onchange = action('Change action fired');

export default { title: 'Inputs|File Input' };

export const File = () => <FileInput label="Test" name="Test" placeholder="Test" onChange={onchange} />;
