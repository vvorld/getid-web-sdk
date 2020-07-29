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
const Footer = ({
  next, back, disable, additional,
}) => {
  const { translations } = useContext(TranslationsContext); // this.context;

  return (
    <>
      { next && <button className={css.footerButton} disable={disable} onClick={!disable && next}>Go next</button> }
      { additional && <button className={`${css.footerButton} ${css.additional}`} onClick={additional.onClick}>{additional.text}</button> }
      { back && <button className={`${css.footerButton} ${css.goBack}`} onClick={back}>{translations.button_back}</button>}
      {!additional && !back && <div className={css.placeholder}>&nbsp;</div>}
      <footer className={css.footer}>
        <PoweredBy />
      </footer>
    </>
  );
};

export default Footer;
