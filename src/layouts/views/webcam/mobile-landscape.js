import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core';
import landscapeIcon from '../../../assets/icons/views/landscape.svg';
import TranslationsContext from '../../../context/TranslationsContext';

const useStyles = makeStyles(({ palette }) => ({
  root: {
    position: 'fixed',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    background: 'white',
    zIndex: 100,
    padding: '30px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  text: {
    width: '50%',
    paddingTop: 30,
    textAlign: 'center',
    color: palette.blue.dark,
    opacity: '0.7',
  },
}));

const Landscape = () => {
  const classes = useStyles();
  const { translations } = useContext(TranslationsContext);
  return (
    <div className={classes.root}>
      <img
        className={classes.picture}
        src={landscapeIcon}
        alt="mobile landscape"
        data-role="mobile-landscape"
      />
      <div className={classes.text}>
        {translations.mobile_landscape}
      </div>
    </div>
  );
};

Landscape.propTypes = {
};

export default Landscape;
