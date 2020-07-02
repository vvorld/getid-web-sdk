import React from 'react';
import ActionBar from '../action-bar/action-bar';
import FooterStyles from './style';
import PoweredBy from '../powered-by/index';

const Footer = (props) => {
  console.log(props)
  const classes = FooterStyles();
  return (
    <div>
      <div className={classes.lineLong} data-role="preFooter" />
      <ActionBar {...(props)} />
      <PoweredBy />
    </div>
  );
};

export default Footer;
