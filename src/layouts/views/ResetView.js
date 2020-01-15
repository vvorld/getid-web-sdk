import React, { useContext } from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import ResetStyles from '../../assets/jss/views/ResetView';
import ButtonStyles from '../../assets/jss/components/buttons/Button';
import TranslationsContext from '../../context/TranslationsContext';

import CustomLogo from '../../components/Logo/CustomLogo';

const ResetView = (props) => {
  const { buttonConfig } = props;
  const viewStyle = ResetStyles();
  const buttonStyle = ButtonStyles();
  const { translations } = useContext(TranslationsContext);

  return (
    <div>
      <CustomLogo condition="Reset" />
      <h3 className={viewStyle.header}>
        {translations.ResetPage_header}
      </h3>
      <hr className={viewStyle.hr} />
      <h5 className={viewStyle.subHeader}>
        {translations.ResetPage_subHeader}
      </h5>
      <hr className={viewStyle.hrLong} />
      <div className={viewStyle.center}>
        {Object.keys(buttonConfig).map((key) => (
          <Grid item xs={6} sm={4}>
            <Button
              key={`button-${key}`}
              classes={{
                root: buttonStyle.root,
              }}
              className={buttonStyle[buttonConfig[key].class]}
              onClick={buttonConfig[key].action}
            >
              {buttonConfig[key].name}
            </Button>
          </Grid>
        ))}
      </div>
    </div>
  );
};

ResetView.propTypes = {
  buttonConfig: PropTypes.object.isRequired,
};

export default ResetView;
