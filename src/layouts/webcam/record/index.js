import React from 'react';

import { isMobile } from '~/helpers/generic';
import RecordStep from './video-steps';

import Guide from '~/components/guide';

const guide = (src) => () => <Guide src={src} />;

const Record = (props) => (
  <RecordStep
    {...props}
    componentName="Video"
    isMobile={isMobile()}
    // 'https://cdn.getid.cloud/assets/mobile/passport.svg',
    Guide={guide('https://cdn.getid.cloud/assets/desktop/recording.svg')}
    facingMode={{ exact: 'environment' }}
  />
);

export {
  Record,
};
