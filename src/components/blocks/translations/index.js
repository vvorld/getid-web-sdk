import React, { useContext } from 'react';
import propTypes from 'prop-types';
import TranslationsContext from '~/context/TranslationsContext';

const translate = (step, element) => {
  const { translations } = useContext(TranslationsContext);
  return translations[`${step}_${element}`] || `${step}_${element}`;
};

export const getConst = (name) => {
  const { translations } = useContext(TranslationsContext);
  return translations[`Const_${name}`] || name;
};
const Translation = ({ step, element, style }) => (
  // eslint-disable-next-line react/no-danger
  <span style={style} dangerouslySetInnerHTML={{ __html: translate(step, element) }} />
);

Translation.propTypes = {
  step: propTypes.string.isRequired,
  element: propTypes.string.isRequired,
};
export default Translation;
