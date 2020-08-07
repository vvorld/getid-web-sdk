import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import PoweredBy from '../powered-by/index';
import TranslationsContext from '../../../context/TranslationsContext';
import './footer.css';
import './button.css';

const Footer = ({ next = {}, back = {}, style }) => {
  if (!next) {
    next = {};
  }
  if (!back) {
    back = {};
  }
  const { translations } = useContext(TranslationsContext); // this.context;
  return (
    <div className="getid-footer__container" style={style}>
      <div className="getid-button__wrapper">
        {next.onClick
          ? (
            <button autoFocus type="button" className="getid-button__main getid-violet" disabled={next.disable} onClick={next.onClick}>
              {next.text || translations.button_next}
            </button>
          )
          : (
            <div className="getid-hidden">
              <button type="button" className="getid-button__main">-</button>
            </div>
          )}
      </div>

      {back.onClick
        ? <a onClick={back.onClick} className="getid-btn__back">{back.text || translations.button_back}</a>
        : <a className="getid-btn__back getid-hidden">-</a>}

      <footer className="getid-footer">
        <PoweredBy />
      </footer>
    </div>
  );
};

Footer.propTypes = {
  next: PropTypes.shape({
    text: PropTypes.string,
    disable: PropTypes.bool,
    onClick: PropTypes.func,
  }),
  back: PropTypes.shape({
    onClick: PropTypes.func,
    text: PropTypes.string,
  }),
};

Footer.defaultProps = {
  next: null,
  back: null,
};

export default Footer;
