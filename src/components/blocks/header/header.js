import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Grid } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import CustomLogo from '../../logo/custom-logo';
import TranslationsContext from '../../../context/TranslationsContext';
import { isMobile } from '../../../helpers/generic';

function Header(props) {
  const { currentComponent, cameraComponent } = props;

  const { translations } = useContext(TranslationsContext);
  const { component } = currentComponent;
  let subHeaderText;
  let headerText;

  const isThankYou = () => component.includes('ThankYou') && 'ThankYou';
  const componentName = component[0];
  headerText = translations[`${componentName}_header`];
  subHeaderText = translations[`${componentName}_subHeader`];

  if (isMobile()) {
    subHeaderText = translations[`${componentName}_subHeader_mobile`] || translations[`${componentName}_subHeader`];
  }

  if (componentName === 'PreviewForm') {
    headerText = translations[`${componentName}_${cameraComponent}`];
  }

  return (
    <Grid container alignItems="center" justify="center" data-role="header">
      <Grid
        style={{
          marginBottom: '40px',
        }}
        container
        alignItems="center"
        justify="center"
      >
        <Grid item xs={10} sm={8} md={6}>
          <CustomLogo condition={isThankYou()} />
          { headerText && (
            <Typography
              variant="h1"
              data-role="componentTitle"
            >
              { headerText }
            </Typography>
          )}
          { subHeaderText && (
            <Typography variant="h2">
              { subHeaderText }
            </Typography>
          ) }
        </Grid>
      </Grid>
    </Grid>
  );
}

Header.propTypes = {
  currentComponent: PropTypes.object.isRequired,
  cameraComponent: PropTypes.string.isRequired,
};

export default Header;
