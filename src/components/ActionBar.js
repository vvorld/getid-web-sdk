import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Icon from '@material-ui/core/Icon';
import buttonStyles from '../assets/jss/components/buttons/Button';
import BackIcon from '../assets/icons/views/arrow-back.svg';
import NextIcon from '../assets/icons/views/arrow-next.svg';
import TranslationsContext from '../context/TranslationsContext';

const ActionBar = (props) => {
  const { next, back } = props;
  const { translations } = useContext(TranslationsContext);

  const defaultProps = {
    next: {
      text: translations.button_next,
      className: 'isGradient',
      iconItem: NextIcon,
    },
    back: {
      text: translations.button_back,
      className: 'prevButton',
      iconItem: BackIcon,
    },
    noIcon: {
      text: translations.button_next,
      className: 'isGradient',
    },
  };

  const CustomButton = (args) => {
    const { type } = args;
    const data = { ...defaultProps[type], ...args };

    const {
      text,
      iconItem,
      hidden,
      disabled,
      action,
      className,
    } = data;

    const icon = (iconSVG) => (
      <Icon>
        <img alt="icon" src={iconSVG} />
      </Icon>
    );

    const styles = buttonStyles();

    return (!hidden
      ? (
        <Grid container justify="center" spacing={1}>
          <Grid item xs={12}>
            <Button
              data-role={`btn_${text}`}
              classes={{
                root: styles.root,
              }}
              className={styles[className]}
              startIcon={(type === 'back' && icon(iconItem))}
              endIcon={(type === 'next' && icon(iconItem))}
              onClick={action}
              disabled={disabled}
            >
              {text}
            </Button>
          </Grid>
        </Grid>
      )
      : null);
  };

  const defaultNav = () => {
    const styles = buttonStyles();
    return (
      <Grid container justify="flex-start" className={styles.footerBlock} data-role="footerBlock">
        <Grid className={styles.backButtonWrapper} item xs={12} sm={3}>
          {CustomButton({ ...back })}
        </Grid>
        <Grid className={styles.nextButtonWrapper} item xs={12} sm={6}>
          {CustomButton({ ...next })}
        </Grid>
        <Grid item xs={12} sm={3} />
      </Grid>
    );
  };

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
