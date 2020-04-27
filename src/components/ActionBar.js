import React from 'react';
import actionBarStyles from '../assets/jss/views/ActionBar';

import CustomButton from './CustomButton';

const ActionBar = (props) => {
  const styles = actionBarStyles();

  return (
    <div className={styles.footerBlock} data-role="footerBlock">
      {Object.values(props).map((item) => (item
            && (
            <CustomButton key={item.type} args={item} />
            )
      ))}
    </div>
  );
};

export default ActionBar;
