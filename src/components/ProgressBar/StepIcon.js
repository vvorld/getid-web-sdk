import clsx from 'clsx';
import PropTypes from 'prop-types';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import stepperTheme from '../../assets/jss/Stepper';
import Checkmark from './Checkmark';

import doneActive from '../../assets/icons/done-active.svg';
import done from '../../assets/icons/done.svg';

const { main, light } = stepperTheme.palette.primary;
const { width, height, borderRadius } = stepperTheme.shape;

const customisedStepIconStyles = makeStyles({
  root: {
    width,
    height,
    backgroundColor: light,
    zIndex: 1,
    display: 'flex',
    borderRadius,
    justifyContent: 'center',
    alignItems: 'center',
  },
  active: {
    width,
    height,
    background: main,
  },
  completed: {
    width,
    height,
    background: main,
  },
  none: {
    background: 'transparent',
  },
});

function customisedStepIcon(props) {
  const classes = customisedStepIconStyles();
  const {
    active, completed, icon, last,
  } = props;

  const icons = {};
  const isLastComponent = ((last === icon) && active);

  const imgSrc = isLastComponent ? doneActive : done;
  icons[last] = <Checkmark className={clsx(classes.img)} source={imgSrc} />;

  return (
    <div
      className={clsx(classes.root, {
        [classes.active]: active,
        [classes.completed]: completed,
        [classes.none]: last === icon,
      })}
    >
      {icons[String(icon)]}
    </div>
  );
}

customisedStepIcon.propTypes = {
  active: PropTypes.bool,
  completed: PropTypes.bool,
  icon: PropTypes.node,
  last: PropTypes.number,
};

customisedStepIcon.defaultProps = {
  active: false,
  completed: false,
  icon: null,
  last: null,
};

export default customisedStepIcon;
