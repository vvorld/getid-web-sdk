import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Grid } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import CustomLogo from '../../logo/custom-logo';
import TranslationsContext from '../../../context/TranslationsContext';
import { isMobile } from '../../../helpers/generic';
import headerStyles from './style';

function Header(props) {
  const {
    currentComponent, cameraComponent, isPhotoPreview,
  } = props;

  const classes = headerStyles();

  const { translations } = useContext(TranslationsContext);
  const { component } = currentComponent;
  let subHeaderText;

  const isThankYou = () => component.includes('ThankYou') && 'ThankYou';
  const componentName = component[0];

  subHeaderText = translations[`${componentName}_subHeader`];
  if (isMobile()) {
    subHeaderText = translations[`${componentName}_subHeader_mobile`] || translations[`${componentName}_subHeader`];
  }

  const headerText = isPhotoPreview ? translations[`PreviewForm_${cameraComponent}`]
    : translations[`${componentName}_header`];

  return (
    <Grid container alignItems="center" justify="center" data-role="header">
      <Grid className={classes.root}
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
  isPhotoPreview: PropTypes.bool,
  cameraComponent: PropTypes.string,
};

Header.defaultProps = {
  cameraComponent: null,
  isPhotoPreview: false,
};

export default Header;
