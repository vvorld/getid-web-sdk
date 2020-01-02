import React from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import { makeStyles, fade } from '@material-ui/core/styles';

import colors from '../../assets/theme';
import messages from '../../messages/messages';
import CustomLogo from '../../components/Logo/CustomLogo';

const { palette } = colors;
const useStyles = makeStyles(() => ({
  header: {
    color: palette.blue,
    fontSize: '32px',
    letterSpacing: '0.192941px',
    lineHeight: '41px',
  },
  subHeader: {
    margin: '16px 8px 30px 8px',
    fontSize: '15px',
    fontStyle: 'normal',
    fontWeight: 'normal',
    lineHeight: '22px',
    color: palette.blueDark,
    opacity: '0.7',
  },
  hr: {
    background: fade(palette.violet, 0.5),
    border: '0',
    height: '1px',
    margin: '20px auto',
    width: '30px',
  },
  hrLong: {
    background: fade(palette.violet, 0.5),
    border: '0',
    height: '1px',
    margin: '20px auto',
    width: '100%',
  },
  center: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    textAlign: 'center',
    padding: '1rem 0',
  },
}));

const ResetView = (props) => {
  const { buttonConfig } = props;
  const classes = useStyles();
  return (
    <div>
      <CustomLogo condition="Reset" />
      <h3 className={classes.header}>
        {messages.header.ResetPage}
      </h3>
      <hr className={classes.hr} />
      <h5 className={classes.subHeader}>
        {messages.subHeader.ResetPage}
      </h5>
      <hr className={classes.hrLong} />
      <div className={classes.center}>
        {Object.keys(buttonConfig).map((key) => (
          <Grid item xs={6} sm={4}>
            <Button
              key={`button-${key}`}
              className={buttonConfig[key].class}
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
