import React from 'react';
import { isMobile } from '../../../helpers/generic';
import DesktopFooter from './desktop-footer/desktop-footer';
import MobileFooter from './mobile-footer/mobile-footer';

const Footer = (props) => (
  isMobile() ? <MobileFooter {...props} /> : <DesktopFooter {...props} />
);

export default Footer;
