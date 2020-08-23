import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './guide.css';

const cache = {

};
const Guide = ({ src }) => {
  const [code, setCode] = useState('');
  if (!cache[src]) {
    cache[src] = fetch(src).then((r) => r.text()).then((x) => x.replace('<svg', '<svg class="getid-guide__img"'));
  }
  cache[src].then(setCode);
  return (
    <div className="getid-guide__container" dangerouslySetInnerHTML={{ __html: code }} />
  );
};

Guide.propTypes = {
  src: PropTypes.string.isRequired,
};

export default Guide;
