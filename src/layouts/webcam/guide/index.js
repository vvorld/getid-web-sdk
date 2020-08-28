import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './guide.css';

const cache = {

};

const transforms = {
  'rgb(156,119,224)': '#105EF6',
};

const modifySvg = (svgText) => Object.entries(transforms)
  .reduce((text, v) => text.split(v[0]).join(v[1]), svgText);

// const urlCreator = window.URL || window.webkitURL;
const Guide = ({ src }) => {
  const [blob, setBlob] = useState('');
  if (!cache[src]) {
    cache[src] = fetch(src)
      .then((r) => r.text())
      .then((text) => {
        // change primary to something else
        const svgText = modifySvg(text);
        const blobB = new Blob([svgText], { type: 'image/svg+xml' });
        return URL.createObjectURL(blobB);
      });
  }
  cache[src].then(setBlob);

  return (
    <div className="getid-guide__container">
      <img alt="guide" className="getid-guide__img" src={blob} />
    </div>
  );
};

Guide.propTypes = {
  src: PropTypes.string.isRequired,
};

export default Guide;
