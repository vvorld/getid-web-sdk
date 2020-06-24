import React from 'react';
import PoweredBy from '../powered-by/index';

const Footer = () => (
  <div>
    <button>Go next</button>
    <a href="./doc-types.html" className="go-back">Go back</a>
    <PoweredBy />
  </div>
);

export default Footer;
