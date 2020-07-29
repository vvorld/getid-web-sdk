import React from 'react';
import PropTypes from 'prop-types';
import './guide.css';

const Guide = ({ src }) => (
  <div className="getid-guide__container">
    <img className="getid-guide__img" src={src} />
  </div>
);

Guide.propTypes = {
  src: PropTypes.string.isRequired,
};

export default Guide;
