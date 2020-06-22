import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import TranslationsContext from '../../../context/TranslationsContext';
import { isMobile } from '../../../helpers/generic';

function Header(props) {
  const { currentComponent } = props;

  const { translations } = useContext(TranslationsContext);
  const { component } = currentComponent;
  let subHeaderText;

  const componentName = component[0];
  const headerText = translations[`${componentName}_header`];
  subHeaderText = translations[`${componentName}_subHeader`];

  if (isMobile()) {
    subHeaderText = translations[`${componentName}_subHeader_mobile`] || translations[`${componentName}_subHeader`];
  }

  return (
    <div data-role="header">
      <div>
        { headerText && (
          <h1 data-role="componentTitle">
            { headerText }
          </h1>
        )}
        { subHeaderText && (
          <h2>
            { subHeaderText }
          </h2>
        ) }
      </div>
    </div>
  );
}

Header.propTypes = {
  currentComponent: PropTypes.object.isRequired,
};

export default Header;
