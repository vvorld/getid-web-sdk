import React, { useContext } from 'react';
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
        <button type="button" className="getid-button__main getid-violet" disable={next.disable} onClick={next.onClick}>
          {next.text || translations.button_next}
        </button>
      </div>
      ) }
      { back
        ? <a onClick={back.onClick} className="getid-btn__back">{back.text || translations.button_back}</a>
        : <div className="getid-placeholder">&nbsp;</div>}
      <footer className="getid-footer">
        <PoweredBy />
      </footer>
    </>
  );
};

export default Footer;
