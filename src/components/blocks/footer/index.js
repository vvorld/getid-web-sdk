import React from 'react';
import { Grid } from '@material-ui/core';
import { isMobile } from '../../../helpers/generic';
import DesktopFooter from './desktop-footer/desktop-footer';
import MobileFooter from './mobile-footer/mobile-footer';

const Footer = (props) => (
  <Grid container justify="center" alignItems="center">
    <Grid xs={11} sm={9} item md={12}>
      { isMobile() ? <MobileFooter {...props} /> : <DesktopFooter {...props} /> }
    </Grid>
  </Grid>
);

export default Footer;
