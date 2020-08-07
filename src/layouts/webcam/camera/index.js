import React from 'react';
import Desktop from './desktop-camera';
import Mobile from './mobile-camera';

const Camera = (props) => (props.isMobile ? <Mobile {...props} /> : <Desktop {...props} />);

export default Camera;
