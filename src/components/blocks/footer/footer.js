import React, { useContext } from 'react';
import PoweredBy from '../powered-by/index';
import TranslationsContext from '../../../context/TranslationsContext';
import './footer.css';
import './button.css';

/*  nextButtonText = () => {
    const { translations } = this.context;

    if (this.isPage('ThankYou')) return translations.button_start_over;
    if (this.isPage('Consent') && (this.nextComponent() && !this.nextComponent().component.includes('ThankYou'))) return translations.button_agree;
    return this.isButtonToSubmitData() ? translations.button_submit : translations.button_next;
  };
  */
const Footer = ({
  next, back, disable, additional,
}) => {
  const { translations } = useContext(TranslationsContext); // this.context;

  return (
    <>

      { next && <div className="getid-button__wrapper"><button type="button" className="getid-button__main getid-violet" disable onClick={next}>Go next</button></div> }
      { additional && <button className="getid-footer_button getid-footer_additional" onClick={additional.onClick}>{additional.text}</button> }
      { back && <a onClick={back} className="getid-btn__back">{translations.button_back}</a>}
      {!additional && !back && <div className="getid-placeholder">&nbsp;</div>}
      <footer className="getid-footer">
        <PoweredBy />
      </footer>
    </>
  );
};

export default Footer;
