import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { isMobile } from '../../helpers/generic';
import { getFormValues } from '../../store/selectors';

const AnimatedSvg = {
  front: 'https://cdn.getid.cloud/assets/desktop/default_front.svg',
  back: 'https://cdn.getid.cloud/assets/desktop/default_back.svg',
  passport: 'https://cdn.getid.cloud/assets/desktop/passport.svg',
  frontMobile: 'https://cdn.getid.cloud/assets/mobile/default_front.svg',
  backMobile: 'https://cdn.getid.cloud/assets/mobile/default_back.svg',
  passportMobile: 'https://cdn.getid.cloud/assets/mobile/passport.svg',
  selfieMobile: 'https://cdn.getid.cloud/assets/mobile/selfie.svg',
  selfie: 'https://cdn.getid.cloud/assets/desktop/selfie.svg',
};

const Guide = ({ component }) => {
  const fieldValues = useSelector((state) => getFormValues(state));
  const isPassport = !!Object.values(fieldValues)
    .find(({ DocumentType }) => (DocumentType && DocumentType.value === 'passport'));

  const source = () => {
    if (component === 'selfie') {
      return AnimatedSvg[`${component}${isMobile() ? 'Mobile' : ''}`];
    }
    return AnimatedSvg[`${isPassport ? 'passport' : component}${isMobile() ? 'Mobile' : ''}`];
  };

  return (
    <div>
      <object type="image/svg+xml" data={source()} aria-label={`${component}_guide`} />
      <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" id="elo6xpdttruc1" viewBox="0 0 342 196" shapeRendering="geometricPrecision" textRendering="geometricPrecision" />
    </div>
  );
};

Guide.propTypes = {
  component: PropTypes.string.isRequired,
};

export default Guide;
