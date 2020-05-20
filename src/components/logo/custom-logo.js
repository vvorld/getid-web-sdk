import React from 'react';
import PropTypes from 'prop-types';

import getIdLogo from '../../assets/icons/getid-logo.svg';
import thankyou from '../../assets/icons/thank-you-logo.svg';
import reset from '../../assets/icons/error-icon.svg';
import imgStyles from './style';

const logoMapping = {
  getIdLogo,
  ThankYou: thankyou,
  Reset: reset,
};

function CustomLogo(props) {
  const { condition, text } = props;
  if (!condition) return null;
  const styles = imgStyles();
  return (
    <div className={styles.block}>
      {text && <span className={styles.text}>{text}</span>}
      <img className={`${styles.img} ${condition}`} data-role="logo" src={logoMapping[condition]} alt={`${condition}-logo`} />
    </div>
  );
}

CustomLogo.propTypes = {
  condition: PropTypes.any,
  text: PropTypes.string,
};

CustomLogo.defaultProps = {
  condition: null,
  text: null,
};

export default CustomLogo;
