import React from 'react';
import poweredByStyles from './style';
import getidLogo from '../../../assets/icons/getid-small.svg';

const PoweredBy = () => {
  const classes = poweredByStyles();
  return (
    <div className={classes.block}>
      <span className={classes.text}>Powered by</span>
      <img src={getidLogo} alt="getid" data-role="getidLogo" />
    </div>
  );
};

export default PoweredBy;
