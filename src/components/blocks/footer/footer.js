import React from 'react';
import PoweredBy from '../powered-by/index';

import css from './footer.css';

const Footer = () => (
  <>
    <button>Go next</button>
    <a href="./doc-types.html" className={css.goBack}>Go back</a>
    <footer className={css.footer}>

      <PoweredBy />
    </footer>
  </>
);

export default Footer;
