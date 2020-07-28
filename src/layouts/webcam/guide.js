import React from 'react';
import PropTypes from 'prop-types';
import { isMobile } from '../../helpers/generic';
import css from './webcam.css';

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

const Guide = ({ component, isPassport }) => {
  const source = () => {
    if (component === 'selfie') {
      return AnimatedSvg[`${component}${isMobile() ? 'Mobile' : ''}`];
    }
    return AnimatedSvg[`${isPassport ? 'passport' : component}${isMobile() ? 'Mobile' : ''}`];
  };

  return (
    <div className="getid-guide__container">
      <img className="getid-guide__img" src={source()} />
      <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 342 196" />
    </div>
  );
};

Guide.propTypes = {
  component: PropTypes.string.isRequired,
};

export default Guide;
