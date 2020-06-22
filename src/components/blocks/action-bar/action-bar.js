import React from 'react';

import CustomButton from '../../buttons/custom-button';

const ActionBar = (props) => (
  <div data-role="footerBlock">
    {Object.values(props).map((item) => (item
        && (
        <CustomButton key={item.direction} args={item} />
        )
    ))}
  </div>
);

export default ActionBar;
