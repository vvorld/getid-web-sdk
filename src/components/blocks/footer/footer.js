import React from 'react';
import ActionBar from '../action-bar/action-bar';
import FooterStyles from './style';

const Footer = (props) => {
  const classes = FooterStyles();
  return (
    <div>
      <div className={classes.lineLong} data-role="preFooter" />
      <ActionBar {...(props)} />
    </div>
  );
};

export default Footer;
