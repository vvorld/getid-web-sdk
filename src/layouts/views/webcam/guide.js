import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core';
import { isMobile } from '../../../helpers/generic';
import { DefaultBackDesktop, DefaultFrontDesktop, PassportDesktop } from '../../../assets/animations/desktop/index';
import {
  DefaultBackMobile,
  DefaultFrontMobile,
  PassportMobile,
} from '../../../assets/animations/mobile/index';
import { getFormValues } from '../../../store/selectors';

const AnimatedSvg = {
  front: DefaultFrontDesktop,
  back: DefaultBackDesktop,
  passport: PassportDesktop,
  frontMobile: DefaultFrontMobile,
  backMobile: DefaultBackMobile,
  passportMobile: PassportMobile,
};

const useStyles = makeStyles((theme) => ({
  guide: {
    border: `1px solid ${theme.palette.violet.main}`,
    borderRadius: 8,
    width: '100%',
  },
}));

const Guide = ({ component }) => {
  const fieldValues = useSelector((state) => getFormValues(state));
  const classes = useStyles();

  const isPassport = !!Object.values(fieldValues)
    .find(({ DocumentType }) => (DocumentType && DocumentType.value === 'passport'));

  const source = component !== 'selfie' && AnimatedSvg[`${isPassport ? 'passport' : component}${isMobile() ? 'Mobile' : ''}`];

  return (
    <div>
      <div className="guide">
        <img className={classes.guide} alt={source} src={source} />
      </div>
    </div>
  );
};

Guide.propTypes = {
  component: PropTypes.string.isRequired,
};

export default Guide;
