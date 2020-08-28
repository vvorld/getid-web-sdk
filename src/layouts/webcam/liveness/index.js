import React from 'react';

import { isMobile } from '~/helpers/generic';
import LivenessStep from './liveness-steps';
import Guide from '~/components/guide';

const guide = (src) => () => <Guide src={src} />;

const Liveness = (props) => (
  <LivenessStep
    {...props}
    componentName="Liveness"
    isMobile={isMobile()}
    // 'https://cdn.getid.cloud/assets/mobile/passport.svg',
    Guide={guide('https://cdn.getid.cloud/assets/desktop/recording.svg')}
    facingMode={{ exact: 'environment' }}
  />
);

export {
  Liveness,
};
