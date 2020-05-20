import Checkbox from '@material-ui/core/Checkbox';
import React from 'react';
import clsx from 'clsx';
import customCheckbox from './style';

function CustomCheckbox(props) {
  const classes = customCheckbox();

  return (
    <Checkbox
      classes={{ root: classes.root, checked: classes.checked, label: classes.label }}
      icon={<span className={classes.icon} />}
      checkedIcon={<span className={clsx(classes.icon, classes.checkedIcon)} />}
      {...props}
    />
  );
}

export default CustomCheckbox;
