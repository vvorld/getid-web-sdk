import React from 'react';
import PropTypes from 'prop-types';
import css from './guide.css';

const Guide = ({ src }) => (
  <div className={css.guideContainer}>
    <img className={css.guide} src={src} />
  </div>
);

Guide.propTypes = {
  src: PropTypes.string.isRequired,
};

export default Guide;
