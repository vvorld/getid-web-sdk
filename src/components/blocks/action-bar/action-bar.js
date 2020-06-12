import React from 'react';
import actionBarStyles from './style';

import CustomButton from '../../buttons/custom-button';

const ActionBar = (props) => {
  const styles = actionBarStyles();

  return (
    <div className={styles.footerBlock} data-role="footerBlock">
      {Object.values(props).map((item) => (item
            && (
            <CustomButton key={item.direction} args={item} />
            )
      ))}
    </div>
  );
};

export default ActionBar;
