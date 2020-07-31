import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import PoweredBy from '../powered-by/index';
import TranslationsContext from '../../../context/TranslationsContext';
import './footer.css';
import './button.css';

const Footer = ({ next, back }) => {
  const { translations } = useContext(TranslationsContext); // this.context;

  return (
    <>
      { next && (
      <div className="getid-button__wrapper">
        <button type="button" className="getid-button__main getid-violet" disabled={next.disable} onClick={next.onClick}>
          {next.text || translations.button_next}
        </button>
      </div>
      ) }
      { back
      // eslint-disable-next-line jsx-a11y/anchor-is-valid,jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
        ? <a onClick={back.onClick} className="getid-btn__back">{back.text || translations.button_back}</a>
        : <div className="getid-placeholder">&nbsp;</div>}
      <footer className="getid-footer">
        <PoweredBy />
      </footer>
    </>
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
