import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Icon from '@material-ui/core/Icon';

import BackIcon from '../assets/icons/views/arrow-back.svg';
import NextIcon from '../assets/icons/views/arrow-next.svg';

const defaultProps = {
  next: {
    text: 'next',
    classes: 'next-button is-gradient',
    iconItem: NextIcon,
  },
  back: {
    text: 'back',
    classes: 'prev-button',
    iconItem: BackIcon,
  },
  noIcon: {
    text: 'next',
    classes: 'next-button is-gradient',
  },
};

const ActionBar = (props) => {
  const { next, back } = props;

  const CustomButton = (args) => {
    const { type } = args;
    const data = { ...defaultProps[type], ...args };
    const {
      text,
      iconItem,
      hidden,
      disabled,
      action,
      classes,
    } = data;

    const icon = (iconSVG) => (
      <Icon>
        <img alt="icon" src={iconSVG} />
      </Icon>
    );

    return (!hidden
      ? (
        <Button
          data-role={`btn_${text}`}
          className={classes}
          startIcon={(type === 'back' && icon(iconItem))}
          endIcon={(type === 'next' && icon(iconItem))}
          onClick={action}
          disabled={disabled}
        >
          {text}
        </Button>
      )
      : null);
  };

  const defaultNav = () => (
    <Grid container justify="center" data-role="footerBlock">
      <Grid item style={{ textAlign: 'left' }} xs={back.hidden ? 12 : 6} sm={3}>{CustomButton({ ...back })}</Grid>
      <Grid item xs={back.hidden ? 12 : 6} sm={back.hidden ? 12 : 6}>
        {CustomButton({ ...next })}
      </Grid>
      <Grid item xs={12} sm={3} />
    </Grid>
  );

  return (
    <div>
      {defaultNav()}
    </div>
  );
};

ActionBar.propTypes = {
  next: PropTypes.object.isRequired,
  back: PropTypes.object.isRequired,
};

export default ActionBar;
