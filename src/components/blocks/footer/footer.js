import React, { useContext } from 'react';
import PoweredBy from '../powered-by/index';
import TranslationsContext from '../../../context/TranslationsContext';
import css from './footer.css';

/*  nextButtonText = () => {
    const { translations } = this.context;

    if (this.isPage('ThankYou')) return translations.button_start_over;
    if (this.isPage('Consent') && (this.nextComponent() && !this.nextComponent().component.includes('ThankYou'))) return translations.button_agree;
    return this.isButtonToSubmitData() ? translations.button_submit : translations.button_next;
  };
  */
const Footer = ({ next, back, disable }) => {
  const { translations } = useContext(TranslationsContext); // this.context;
  return (
    <>
      { next && <button disable onClick={next}>Go next</button> }
      { back && <a onClick={back} className={css.goBack}>{translations.button_back}</a>}
      <footer className={css.footer}>
        <PoweredBy />
      </footer>
    </>
  );
};

export default Footer;
