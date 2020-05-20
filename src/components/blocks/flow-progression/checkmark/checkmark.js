import React from 'react';
import PropTypes from 'prop-types';

function Checkmark(props) {
  const { source } = props;
  return (
    <div>
      <img alt="checkmark" src={source} />
    </div>
  );
}

Checkmark.propTypes = {
  source: PropTypes.string.isRequired,
};

export default Checkmark;
