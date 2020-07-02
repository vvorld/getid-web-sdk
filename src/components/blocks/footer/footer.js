import React from 'react';
import ActionBar from '../action-bar/action-bar';
import FooterStyles from './style';
import PoweredBy from '../powered-by/index';
import { isMobile } from '../../../helpers/generic';

const Footer = (props) => {
  const classes = FooterStyles();
  return (
    <div style={isMobile() && {position: 'fixed',
        bottom: 0}}>
      <div className={classes.lineLong} data-role="preFooter" />
      <ActionBar {...(props)} />
      <PoweredBy />
    </div>
  );
};

export default Footer;
