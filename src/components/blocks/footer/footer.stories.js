import React from 'react';
import { action } from '@storybook/addon-actions';
import Footer from './index';

const onClickBack = action('Change action fired');
const onClickNext = action('Change action fired');

export default { title: 'Blocks|Footer' };

export const FooterWithNextButton = () => <Footer next={onClickNext} />;
export const FooterWithPreviousButton = () => <Footer next={onClickNext} back={onClickBack} />;
