import React from 'react';
import PropTypes from 'prop-types';
import SadSmileSVG from '~/assets/icons/views/sad-smile.svg';

const index = ({ requestCamera, errorMessage }) => (
  <div>
    <img src={SadSmileSVG} alt="something wrong" />
    <div>{errorMessage}</div>
    <button type="button" onClick={requestCamera}>
      try again
    </button>
  </div>
);

index.propTypes = {
  requestCamera: PropTypes.func.isRequired,
  errorMessage: PropTypes.string.isRequired,
};

export default index;
