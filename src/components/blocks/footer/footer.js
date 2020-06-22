import React from 'react';
import ActionBar from '../action-bar/action-bar';
import PoweredBy from '../powered-by/index';

const Footer = (props) => (
  <div>
    <div data-role="preFooter" />
    <ActionBar {...(props)} />
    <PoweredBy />
  </div>
);

export default Footer;
