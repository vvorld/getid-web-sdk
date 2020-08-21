import React, { useContext } from 'react';
import { isMobile } from '../../../helpers/generic';
import TranslationsContext from '../../../context/TranslationsContext';

const translate = (step, element) => {
  const { translations } = useContext(TranslationsContext);

  const im = isMobile();
  if (im && translations[`${step}_${element}_mobile`] !== undefined) {
    return translations[`${step}_${element}_mobile`];
  }
  return translations[`${step}_${element}`] || `${step}_${element}`;
};

export default ({ step, element }) => <span dangerouslySetInnerHTML={{ __html: translate(step, element) }} />;
