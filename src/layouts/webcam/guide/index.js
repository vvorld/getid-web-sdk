import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './guide.css';

const cache = {

};
const urlCreator = window.URL || window.webkitURL;
const Guide = ({ src }) => {
  const [blob, setBlob] = useState('');
  if (!cache[src]) {
    // cache[src] = fetch(src)
    //   .then((r) => r.text())
    //   .then((text) => {
    //     const str = text.split('rgb(206,211,221)').join('rgb(191, 88, 82)');
    //     return str.blob();
    //   }).then((x) => urlCreator.createObjectURL(x));
    cache[src] = fetch(src).then((r) => r.blob()).then((x) => urlCreator.createObjectURL(x));
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
