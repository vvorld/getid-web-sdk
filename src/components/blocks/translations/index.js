import React, { useContext } from 'react';
import propTypes from 'prop-types';
import { isMobile } from '~/helpers/generic';
import TranslationsContext from '~/context/TranslationsContext';

const translate = (step, element) => {
  const { translations } = useContext(TranslationsContext);

  const im = isMobile();
  if (im && translations[`${step}_${element}_mobile`] !== undefined) {
    return translations[`${step}_${element}_mobile`];
  }
  return translations[`${step}_${element}`] || `${step}_${element}`;
};

export const getConst = (name) => {
  const { translations } = useContext(TranslationsContext);
  return translations[`Const_${name}`] || name;
};
const Translation = ({ step, element }) => (
  // eslint-disable-next-line react/no-danger
  <span dangerouslySetInnerHTML={{ __html: translate(step, element) }} />
);

Translation.propTypes = {
  step: propTypes.string.isRequired,
  element: propTypes.string.isRequired,
};
export default Translation;
