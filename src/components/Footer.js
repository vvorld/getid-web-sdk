import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { fade } from '@material-ui/core/styles/colorManipulator';
import ActionBar from './ActionBar';
import Spacebar from '../assets/icons/views/space-bar.svg';
import colors from '../assets/theme';

const { palette } = colors;

const styles = makeStyles(() => ({
  lineLong: {
    opacity: '0.3',
    width: '100%',
    margin: '0px auto 50px',
    border: 0,
    height: '1px',
    background: fade(palette.violet, 0.5),
  },
  text: {
    lineHeight: '22px',
    color: palette.blue,
    opacity: 0.8,
    display: 'inline-block',
    verticalAlign: 'middle',
    textAlign: 'right',
    marginRight: '37px',
  },
  spacebar: {
    margin: '50px auto',
  },
  image: {
    verticalAlign: 'middle',
  },
}));

const Footer = (props) => {
  const { isCameraView, isCameraEnabled } = props;
  const classes = styles();

  return (
    <div>
      <div className={classes.lineLong} style={!isCameraView ? ({ marginTop: '50px' }) : {}} data-role="preFooter" />
      <ActionBar {...(props)} />
      {isCameraView && isCameraEnabled && (
        <div className={classes.spacebar} data-role="photoHelp">
          <div className={classes.text} data-role="textHelp">
            Please use
            {' '}
            {' '}
            <b>Spacebar</b>
            {' '}
            key
            <br />
            to make photo
          </div>
          <img src={Spacebar} alt="click space to make selfie" className={classes.image} data-role="imgHelp" />
        </div>
      )}
    </div>
  );
};

Footer.propTypes = {
  isCameraView: PropTypes.bool.isRequired,
  isCameraEnabled: PropTypes.bool.isRequired,
};

export default Footer;
