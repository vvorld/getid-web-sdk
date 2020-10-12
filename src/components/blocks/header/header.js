import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './style.css';
import Translate from '../translations';

function Header({ step }) {
  const [{ visible, step: st }, setVisible] = useState({ visible: false, step });
  const enableAnimation = !visible || step !== st;
  if (enableAnimation) {
    setTimeout(() => {
      setVisible({ visible: true, step });
    }, 50);
  }
  return (
    <div
      className={`getid-header__container getid-animation${!enableAnimation ? ' getid-visible_1' : ''}`}
      data-role="header"
    >
      <div className="getid-header__big" data-role="header-big">
        <Translate step={step} element="header" />
      </div>
      <div className="getid-header__small" data-role="header-small">
        <Translate step={step} element="subHeader" />
      </div>
    </div>
  );
}

Header.propTypes = {
  step: PropTypes.string.isRequired,
};

export default Header;
