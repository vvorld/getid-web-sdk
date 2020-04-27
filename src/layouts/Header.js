import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Grid } from '@material-ui/core';
import CustomLogo from '../components/Logo/CustomLogo';
import headerStyles from '../assets/jss/views/UpperPart';
import TranslationsContext from '../context/TranslationsContext';
import { isMobile } from '../helpers/generic';

function Header(props) {
  const { currentComponent } = props;

  const { translations } = useContext(TranslationsContext);
  const { component } = currentComponent;
  let subHeaderText;

  const isThankYou = () => component.includes('ThankYou') && 'ThankYou';
  const componentName = component[0];
  const headerText = translations[`${componentName}_header`];
  subHeaderText = translations[`${componentName}_subHeader`];

  if (isMobile()) {
    subHeaderText = translations[`${componentName}_subHeader_mobile`] || translations[`${componentName}_subHeader`];
  }

  const {
    header, hr, subHeader, topPart,
  } = headerStyles();

  return (
    <Grid className={topPart} container alignItems="center" justify="center">
      <Grid item xs={10} sm={8} md={4}>
        <CustomLogo condition={isThankYou()} />
        { headerText && (
          <h3
            data-role="componentTitle"
            className={header}
          >
            { headerText }
          </h3>
        )}
        <hr className={hr} />
        { subHeaderText && (
          <h5 className={subHeader}>
            { subHeaderText }
          </h5>
        ) }
      </Grid>
    </Grid>
  );
}

Header.propTypes = {
  currentComponent: PropTypes.object.isRequired,
};

export default Header;
