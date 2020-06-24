import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import TranslationsContext from '../../../context/TranslationsContext';
import { isMobile } from '../../../helpers/generic';
import css from './style.css';

function Header(props) {
  const { componentName } = props;

  const { translations } = useContext(TranslationsContext);
  const headerText = translations[`${componentName}_header`];
  let subHeaderText = translations[`${componentName}_subHeader`];

  if (isMobile()) {
    subHeaderText = translations[`${componentName}_subHeader_mobile`] || translations[`${componentName}_subHeader`];
  }

  return (
    <>
      { headerText && (
      <h1 className={css.title} data-role="componentTitle">
        { headerText }
      </h1>
      )}
      { subHeaderText && (
      <p className={css.subtitle}>
        { subHeaderText }
      </p>
      ) }
    </>
  );
}

Header.propTypes = {
  componentName: PropTypes.object.isRequired,
};

export default Header;
