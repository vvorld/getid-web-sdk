import React from 'react';

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
            // eslint-disable-next-line no-return-assign
            Object.entries(config.buttons).map(([key, button]) => (
              <button
                type="button"
                key={key}
                className={`getid-${button.name}`}
                onClick={() => window.location.href = button.link}
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

export default Browsers;
