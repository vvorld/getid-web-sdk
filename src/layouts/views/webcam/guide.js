import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
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

const Guide = ({ component }) => {
  const fieldValues = useSelector((state) => getFormValues(state));

  const isPassport = !!Object.values(fieldValues)
    .find(({ DocumentType }) => (DocumentType && DocumentType.value === 'passport'));

  const source = AnimatedSvg[`${isPassport ? 'passport' : component}${isMobile() ? 'Mobile' : ''}`];

  return (
    <div>
      <div className="guide">
        <img alt={source} src={source} />
      </div>
    </div>
  );
};

Guide.propTypes = {
  component: PropTypes.string.isRequired,
};

export default Guide;
