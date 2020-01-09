import React from 'react';
import PropTypes from 'prop-types';
import ActionBar from './ActionBar';
import Spacebar from '../assets/icons/views/space-bar.svg';
import FooterStyles from '../assets/jss/views/Footer';

const Footer = (props) => {
  const { isCameraView, isCameraEnabled } = props;
  const classes = FooterStyles();

  return (
    <div>
      <div className={classes.lineLong} style={!isCameraView ? ({ marginTop: '50px' }) : {}} data-role="preFooter" />
      <ActionBar {...(props)} />
      {isCameraView && isCameraEnabled && (
        <div className={classes.spacebar} data-role="photoHelp">
          <div className={classes.text} data-role="textHelp">
            Please use
            {' '}
            {' '}
            <b>Spacebar</b>
            {' '}
            key
            <br />
            to make photo
          </div>
          <img src={Spacebar} alt="click space to make selfie" className={classes.image} data-role="imgHelp" />
        </div>
      )}
    </div>
  );
};

Footer.propTypes = {
  isCameraView: PropTypes.bool.isRequired,
  isCameraEnabled: PropTypes.bool.isRequired,
};

export default Footer;
