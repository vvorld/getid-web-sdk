import React from 'react';
import Desktop from './desktop-camera';
import Mobile from './mobile-camera';
import { isMobile } from '~/helpers/generic';

const Camera = (props) => (isMobile() ? <Mobile {...props} /> : <Desktop {...props} />);

export default Camera;
