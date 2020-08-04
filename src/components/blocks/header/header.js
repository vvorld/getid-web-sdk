import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import TranslationsContext from '../../../context/TranslationsContext';
import { isMobile } from '../../../helpers/generic';
import './style.css';

function Header(props) {
  const { componentName } = props;

  const { translations } = useContext(TranslationsContext);
  const headerText = translations[`${componentName}_header`];
  let subHeaderText = translations[`${componentName}_subHeader`];

  if (isMobile()) {
    subHeaderText = translations[`${componentName}_subHeader_mobile`] || translations[`${componentName}_subHeader`];
  }

  if (componentName.includes('guide')) {
    subHeaderText = Object.keys(translations).filter((el) => el.includes(`${componentName}_subHeader_`)).map((ele) => translations[ele]);
  }

  return (
    <>
      { headerText && (
      <h1 className="getid-header__big" data-role="componentTitle">
        { headerText }
      </h1>
      )}

      <div style={{minHeight: '36px'}}>
        {Array.isArray(subHeaderText) && (
            <p className="getid-header__small getid-list">
              <ul>
                { subHeaderText.map((el) => (
                    <li>
                      { el }
                    </li>
                ))}
              </ul>
            </p>
        )}
        {typeof subHeaderText === 'string' && <p className="getid-header__small">{subHeaderText}</p>}
      </div>
    </>
  );
}

Header.propTypes = {
  componentName: PropTypes.string.isRequired,
};

export default Header;
