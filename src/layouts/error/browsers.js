import React from 'react';

import PropTypes from 'prop-types';
import chrome from '../../assets/icons/chrome.svg';
import safari from '../../assets/icons/safari.svg';
import firefox from '../../assets/icons/ff.svg';

const icons = {
  chrome,
  safari,
  firefox,
};

const Browsers = ({ config, dictionary }) => (
  <div className="getid-browsers">
    <div style={{ fontWeight: 'bold' }} className="getid-header__small">{config.text(dictionary)}</div>
    {
            Object.entries(config.buttons).map(([key, button]) => (
              <button
                type="button"
                key={key}
                className={`getid-${button.name}`}
                onClick={function () { window.location.href = button.link; }}
              >
                <img alt={key} src={icons[key]} />
                <p>
                  {button.name}
                </p>
              </button>
            ))
        }
  </div>
);

Browsers.propTypes = {
  config: PropTypes.shape({
    buttons: PropTypes.shape({}).isRequired,
    text: PropTypes.func.isRequired,
  }).isRequired,
  dictionary: PropTypes.shape({}).isRequired,
};

export default Browsers;
