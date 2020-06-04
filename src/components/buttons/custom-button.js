import Icon from '@material-ui/core/Icon';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import React from 'react';
import PropTypes from 'prop-types';
import buttonStyles from './style';
import actionBarStyles from '../blocks/action-bar/style';

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
    variant,
  } = args;

  const icon = (iconSVG) => (
    <Icon>
      <img alt="icon" src={iconSVG} />
    </Icon>
  );

  const buttonStyle = buttonStyles();
  const actionBar = actionBarStyles();

  return (
    <div className={actionBar[`${direction}`]}>
      <Grid item xs={width}>
        <Button
          data-role={`btn_${type}`}
          classes={{
            root: buttonStyle.root,
          }}
          variant={variant}
          className={hidden ? ' hidden' : ''}
          startIcon={(type === 'back' && icon(iconItem))}
          onClick={action}
          disabled={disabled}
        >
          {text}
        </Button>
      </Grid>
    </div>
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
    variant: PropTypes.string,
    direction: PropTypes.string,
    width: PropTypes.number,
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
    variant: '',
    direction: '',
    width: 12,
  },
};

export default CustomButton;
