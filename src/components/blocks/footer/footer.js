import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import parse from 'html-react-parser';
import ActionBar from '../action-bar/action-bar';
import Spacebar from '../../../assets/icons/views/space-bar.svg';
import FooterStyles from './style';
import TranslationsContext from '../../../context/TranslationsContext';

const Footer = (props) => {
  const { isCameraView, isCameraEnabled, ...other } = props;
  const classes = FooterStyles();
  const { translations } = useContext(TranslationsContext) || {};
  return (
    <div>
      <div className={classes.lineLong} style={!isCameraView ? ({ marginTop: '50px' }) : {}} data-role="preFooter" />
      <ActionBar {...(other)} />
      {isCameraView && isCameraEnabled && (
        <div className={classes.spacebar} data-role="photoHelp">
          <div className={classes.text} data-role="textHelp">
            {parse(translations.photo_tip || '')}
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