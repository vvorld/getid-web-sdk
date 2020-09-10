import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './guide.css';

import defaultFrontDesktop from '../../assets/animations/photo/default_front_desktop.svg';
import defaultBackDesktop from '~/assets/animations/photo/default_back_desktop.svg';
import passportDesktop from '~/assets/animations/photo/passport_desktop.svg';
import selfieDesktop from '~/assets/animations/photo/selfie_desktop.svg';

import selfieMobile from '~/assets/animations/photo/selfie.svg';
import passportMobile from '~/assets/animations/photo/passport.svg';
import defaultFrontMobile from '~/assets/animations/photo/default_front.svg';
import defaultBackMobile from '~/assets/animations/photo/default_back.svg';

const mapGuide = {
  defaultFrontDesktop,
  defaultBackDesktop,
  passportDesktop,
  selfieDesktop,
  selfieMobile,
  passportMobile,
  defaultFrontMobile,
  defaultBackMobile,
};

const cache = {};
const transforms = {};

const modifySvg = (svgText) => Object.entries(transforms)
  .reduce((text, v) => text.split(v[0]).join(v[1]), svgText);

// const urlCreator = window.URL || window.webkitURL;
const Guide = ({ name, styles }) => {
  const [blob, setBlob] = useState('');

  if (!cache[name]) {
    cache[name] = fetch(mapGuide[name]).then((r) => r.text()).then((text) => {
      let svgText = text;
      if (styles && styles['accent-color']) {
        transforms['rgb(156,119,224)'] = styles['accent-color'];
        svgText = modifySvg(text);
      }
      const blobB = new Blob([svgText], { type: 'image/svg+xml' });
      return URL.createObjectURL(blobB);
    });
  }
  cache[name].then(setBlob);

  return (
    <div className="getid-guide__container">
      <img alt="guide" className="getid-guide__img" src={blob} />
    </div>
  );
};

Guide.propTypes = {
  src: PropTypes.string.isRequired,
  styles: PropTypes.shape({
    'accent-color': PropTypes.string,
  }).isRequired,
};

export default Guide;
