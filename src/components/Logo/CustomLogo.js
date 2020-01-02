import React from 'react';
import PropTypes from 'prop-types';

import consent from '../../assets/icons/getid-logo.svg';
import thankyou from '../../assets/icons/thank-you-logo.svg';
import reset from '../../assets/icons/error-icon.svg';

const logoMapping = {
  Consent: consent,
  ThankYou: thankyou,
  Reset: reset,
};

/**
 * @return {null}
 */
function CustomLogo(props) {
  const { condition } = props;
  if (!condition) return null;
  return <img className="img" data-role="logo" src={logoMapping[condition]} alt={`${condition}-logo`} />;
}

CustomLogo.propTypes = {
  condition: PropTypes.any,
};

CustomLogo.defaultProps = {
  condition: null,
};

export default CustomLogo;
