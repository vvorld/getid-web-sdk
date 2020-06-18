import Checkbox from '@material-ui/core/Checkbox';
import React from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { FormControlLabel } from '@material-ui/core';
import parse from 'html-react-parser';
import customCheckbox from './style';

function CustomCheckbox(props) {
  const classes = customCheckbox();

  return (
    <FormControlLabel
      data-role="checkbox"
      key={`control-${props.label}`}
      control={(
        <Checkbox
          disableRipple
          checkedIcon={<span className={clsx(classes.icon, classes.checkedIcon)} />}
          icon={<span className={classes.icon} />}
          {...props}
        />
          )}
      label={<div className={classes.label}>{parse(props.label)}</div>}
    />
  );
}

CustomCheckbox.propTypes = {
  label: PropTypes.string,
};

CustomCheckbox.defaultProps = {
  label: '',
};

export default CustomCheckbox;
