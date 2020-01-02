import { makeStyles } from '@material-ui/core/styles';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import clsx from 'clsx';
import React from 'react';
import PropTypes from 'prop-types';

const useStyles = makeStyles({
  root: {
    '&:hover': {
      backgroundColor: '#FFF',
    },
  },
  icon: {
    borderRadius: '50%',
    width: 29,
    height: 29,
    border: ' 1px solid rgba(120, 97, 162, 0.5)',
    'input:hover ~ &': {
      boxShadow: 'none',
    },
  },
  checkedIcon: {
    background: 'linear-gradient(46.87deg, #00B1C9 -57.75%, #EA167C 193.27%)',
    '&:before': {
      display: 'block',
      height: 29,
      backgroundImage:
            "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath"
            + " fill-rule='evenodd' clip-rule='evenodd' d='M12 5c-.28 0-.53.11-.71.29L7 9.59l-2.29-2.3a1.003 "
            + "1.003 0 00-1.42 1.42l3 3c.18.18.43.29.71.29s.53-.11.71-.29l5-5A1.003 1.003 0 0012 5z' fill='%23fff'/%3E%3C/svg%3E\")",
      content: '""',
    },
  },
  label: {
    justifyContent: 'space-between',
    color: 'rgba(14, 28, 44, 0.5)',
    borderRadius: 8,
    margin: '10px 0 5px',
    padding: '4px 0',
    border: ' 1px solid rgba(120, 97, 162, 0.5)',
    '&.MuiFormControlLabel-root > .MuiTypography-root.MuiFormControlLabel-label.MuiTypography-body1': {
      paddingLeft: 15,
    },
    '&.selectedVal': {
      border: '1px solid #7861A2',
      color: 'rgba(14, 28, 44, 1)',
    },
  },
});


const Radiobutton = (props) => {
  const classes = useStyles();
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
