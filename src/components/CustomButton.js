import Icon from '@material-ui/core/Icon';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import React from 'react';
import PropTypes from 'prop-types';
import buttonStyles from '../assets/jss/components/buttons/Button';
import actionBarStyles from '../assets/jss/views/ActionBar';

const CustomButton = ({ args }) => {
  const {
    direction,
    width,
    type,
    text,
    iconItem,
    hidden,
    disabled,
    action,
    className,
    component,
    children,
  } = args;

  const icon = (iconSVG) => (
    <Icon>
      <img alt="icon" src={iconSVG} />
    </Icon>
  );

  const buttonStyle = buttonStyles();
  const actionBar = actionBarStyles();

  return (!hidden
&& (
<div className={actionBar[`${direction}`]}>
  <Grid xs={width}>
    <Button
      data-role={`btn_${type}`}
      classes={{
        root: buttonStyle.root,
      }}
      component={component}
      className={buttonStyle[className] + (hidden ? ' hidden' : '')}
      startIcon={(type === 'back' && icon(iconItem))}
      endIcon={(type === 'next' && icon(iconItem))}
      onClick={action}
      disabled={disabled}
    >
      {text}
      {children}
    </Button>
  </Grid>
</div>
)
  );
};

CustomButton.propTypes = {
  args: PropTypes.shape({
    text: PropTypes.string,
    type: PropTypes.string,
    iconItem: PropTypes.node,
    hidden: PropTypes.bool,
    disabled: PropTypes.bool,
    action: PropTypes.func,
    className: PropTypes.string,
    component: PropTypes.elementType,
    children: PropTypes.element,
  }),
};

CustomButton.defaultProps = {
  args: {
    text: '',
    type: '',
    iconItem: '',
    hidden: false,
    disabled: false,
    action: () => {},
    className: '',
    component: 'button',
    children: '',
  },
};

export default CustomButton;
