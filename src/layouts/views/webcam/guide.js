import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core';
import { isMobile } from '../../../helpers/generic';
import {
  DefaultBackDesktop, DefaultFrontDesktop, PassportDesktop, SelfieDesktop,
} from '../../../assets/animations/desktop/index';
import {
  DefaultBackMobile,
  DefaultFrontMobile,
  PassportMobile,
  SelfieMobile,
} from '../../../assets/animations/mobile/index';
import { getFormValues } from '../../../store/selectors';

const AnimatedSvg = {
  front: DefaultFrontDesktop,
  back: DefaultBackDesktop,
  passport: PassportDesktop,
  frontMobile: DefaultFrontMobile,
  backMobile: DefaultBackMobile,
  passportMobile: PassportMobile,
  selfieMobile: SelfieMobile,
  selfie: SelfieDesktop,
};

const useStyles = makeStyles((theme) => ({
  guide: {
    border: `1px solid ${theme.palette.violet.main}`,
    borderRadius: 8,
    maxHeight: 'calc(50vh)',
    maxWidth: '95%',
  },
}));

const Guide = ({ component }) => {
  const fieldValues = useSelector((state) => getFormValues(state));
  const classes = useStyles();

  const isPassport = !!Object.values(fieldValues)
    .find(({ DocumentType }) => (DocumentType && DocumentType.value === 'passport'));

  const source = () => {
    if (component === 'selfie') {
      return AnimatedSvg[`${component}${isMobile() ? 'Mobile' : ''}`];
    }
    return AnimatedSvg[`${isPassport ? 'passport' : component}${isMobile() ? 'Mobile' : ''}`];
  };


  return (
    <img className={classes.guide} alt={`${component}_guide`} src={source()} />
  );
};

Guide.propTypes = {
  component: PropTypes.string.isRequired,
};

export default Guide;
