import React from 'react';

import PropTypes from 'prop-types';
import chrome from '~/assets/icons/chrome.svg';
import safari from '~/assets/icons/safari.svg';
import firefox from '~/assets/icons/ff.svg';
import Translate from '../blocks/translations';

const isApple = /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform) || /Apple/i.test(window.navigator.vendor || '');
const browsers = [
  {
    icon: chrome,
    name: 'Chrome',
    link: 'https://www.google.com/chrome/',
    test: () => !isApple,
  },
  {
    icon: safari,
    name: 'Safari',
    link: 'https://support.apple.com/downloads/safari',
    test: () => isApple,
  },
  {
    icon: firefox,
    name: 'Firefox',
    link: 'https://www.mozilla.org/en-US/firefox/new/',
    test: () => !isApple,
  }].filter((x) => x.test());

const Browsers = () => (
  <div className="getid-browsers">
    <div className="getid-header__small">
      <Translate style={{ fontWeight: 'bold' }} step="browser_not_supported_error" element="variants" />
    </div>
    <div className="getid-browsers__list">
      {
        browsers.map(({ icon, name, link }) => (
          <button
            type="button"
            key={name}
            className={`getid-${name}`}
            onClick={() => { window.location.href = link; }}
          >
            <img alt={name} src={icon} />
            <p>
              {name}
            </p>
          </button>
        ))
    }
    </div>

  </div>
);

Browsers.propTypes = {
  dictionary: PropTypes.shape({}).isRequired,
};

export default Browsers;
