import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './guide.css';

import defaultFrontDesktop from '../../assets/animations/photo/default_front_desktop.svg';
import defaultBackDesktop from '~/assets/animations/photo/default_back_desktop.svg';
import passportDesktop from '~/assets/animations/photo/passport_desktop.svg';
import selfieDesktop from '~/assets/animations/photo/selfie_desktop.svg';
import recordingDesktop from '~/assets/animations/photo/recording.svg';

const mapGuide = {
  defaultFrontDesktop,
  defaultBackDesktop,
  passportDesktop,
  selfieDesktop,
  recordingDesktop,
};

const cache = {};
const transforms = {};

const modifySvg = (svgText) => Object.entries(transforms)
  .reduce((text, v) => text.split(v[0]).join(v[1]), svgText);

const Guide = ({ name, styles }) => {
  const [blob, setBlob] = useState('');

  if (!cache[name]) {
    cache[name] = fetch(mapGuide[name]).then((r) => r.text()).then((text) => {
      let svgText = text;
      if (styles && styles['--getid-accent-color']) {
        transforms['rgb(156,119,224)'] = styles['--getid-accent-color'];
        svgText = modifySvg(text);
      }
      const blobB = new Blob([svgText], { type: 'image/svg+xml' });
      return URL.createObjectURL(blobB);
    });
  }
  cache[name].then(setBlob);

  return (
    <div className="getid-guide__container" data-role="guide">
      <img alt="guide" className="getid-guide__img" src={blob} />
    </div>
  );
};

Guide.propTypes = {
  name: PropTypes.string.isRequired,
  styles: PropTypes.shape({
    '--getid-accent-color': PropTypes.string,
  }),
};

Guide.defaultProps = {
  styles: null,
};

export default Guide;
