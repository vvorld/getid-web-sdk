import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import clsx from 'clsx';
import React from 'react';
import PropTypes from 'prop-types';
import RadioButtonStyles from './style';

const Radiobutton = (props) => {
  const classes = RadioButtonStyles();
  const classname = classes.label + (props.selectedvalue === props.value ? ' selectedVal' : '');

  return (
    <FormControlLabel
      data-role={`radiogroup-${props.value}`}
      value={props.value}
      key={`label-${props.value}`}
      className={classname}
      labelPlacement="start"
      {...props}
      control={(
        <Radio
          data-role="radioBtn"
          className={classes.root}
          disableRipple
          key={`radio-${props.value}`}
          checkedIcon={<span className={clsx(classes.icon, classes.checkedIcon)} />}
          icon={<span className={classes.icon} />}
        />
)}
    />
  );
};


Radiobutton.propTypes = {
  value: PropTypes.any,
  selectedvalue: PropTypes.string,
};

Radiobutton.defaultProps = {
  value: null,
  selectedvalue: null,
};

export default Radiobutton;
