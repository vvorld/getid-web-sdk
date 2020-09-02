/* eslint-disable no-param-reassign */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import PoweredBy from '../powered-by/index';
import './footer.css';
import './button.css';
import Translate from '../translations';

const Footer = ({
  next, back, step, disableAnmation,
}) => {
  if (!next) {
    next = { onClick: null };
  }
  if (!back) {
    back = { onClick: null };
  }
  const [{ visible, step: st }, setVisible] = useState({ visible: disableAnmation, step });
  const enableAnimation = (!visible || step !== st) && !disableAnmation;
  if (enableAnimation) {
    setTimeout(() => {
      setVisible({ visible: true, step });
    }, 50);
  }
  const mainButton = document.getElementById('main');
  if (mainButton) document.getElementById('main').focus();
  return (
    <div className={`getid-footer__container getid-animation${!enableAnimation ? ' getid-visible_3' : ''}`}>
      <div className="getid-button__wrapper">
        {next.onClick
          ? (
            <button
              id="main"
              autoFocus
              type="button"
              className={`getid-button__main ${next.mod ? `getid-${next.mod}` : ''}`}
              disabled={next.disable}
              onClick={() => {
                setVisible({ visible: false, step });
                next.onClick();
              }}
            >
              {next.icon}
              <Translate step={step} element={next.translate || 'next'} />
            </button>
          )
          : (
            <div className="getid-hidden">
              <button type="button" className="getid-button__main">-</button>
            </div>
          )}
      </div>

      {back.onClick
        ? (
          <button
            type="button"
            onClick={() => {
              setVisible({ visible: false, step });
              back.onClick();
            }}
            className="getid-btn__back"
          >
            <Translate step={step} element={back.translate || 'back'} />
          </button>
        )
        : <button type="button" className="getid-btn__back getid-hidden">-</button>}

      <footer className="getid-footer">
        <PoweredBy />
      </footer>
    </div>
  );
};

Footer.propTypes = {
  next: PropTypes.shape({
    translate: PropTypes.string,
    disable: PropTypes.bool,
    onClick: PropTypes.func,
    mod: PropTypes.string,
    icon: PropTypes.node,
  }),
  back: PropTypes.shape({
    onClick: PropTypes.func,
    translate: PropTypes.string,

  }),
  step: PropTypes.string,
  style: PropTypes.shape({}),
  disableAnmation: PropTypes.bool,
};

Footer.defaultProps = {
  next: null,
  back: null,
  style: {},
  step: '',
  disableAnmation: false,
};

export default Footer;
