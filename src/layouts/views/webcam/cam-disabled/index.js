import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import React from 'react';
import PropTypes from 'prop-types';
import SadSmileSVG from '../../../../assets/icons/views/sad-smile.svg';
import buttonStyles from '../../../../components/buttons/style';
import cameraStyles from '../../../../components/camera/style';

const index = ({ requestCamera, errorMessage }) => {
  const buttonClass = buttonStyles();
  const classes = cameraStyles();

  return (
    <Grid container direction="column" alignItems="center" className={classes.cameraDisabled}>
      <Grid item xs={10} sm={9} md={8} lg={7}>
        <img src={SadSmileSVG} alt="something wrong" />
        <div>{errorMessage}</div>
        <Button
          classes={{
            root: buttonClass.root,
          }}
          className={buttonClass.customButton}
          onClick={requestCamera}
        >
          try again
        </Button>
      </Grid>
    </Grid>
  );
};

index.propTypes = {
  requestCamera: PropTypes.func.isRequired,
  errorMessage: PropTypes.string.isRequired,
};

export default index;
