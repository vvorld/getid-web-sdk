import clsx from 'clsx';
import PropTypes from 'prop-types';
import React from 'react';
import Checkmark from './Checkmark';

import doneActive from '../../assets/icons/done-active.svg';
import done from '../../assets/icons/done.svg';
import StepIcon from '../../assets/jss/components/StepIcon';


function customisedStepIcon(props) {
  const classes = StepIcon();
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
