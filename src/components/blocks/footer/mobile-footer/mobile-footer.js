import React from 'react';
import clsx from 'clsx';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import FooterStyles from './style';
import poweredBy from '../../../../assets/icons/views/poweredby-mobile.svg';
import poweredByDark from '../../../../assets/icons/views/poweredby-mobile-dark.svg';

const MobileFooter = (props) => {
  const classes = FooterStyles();
  const { back } = props;
  const darkMode = back && back.theme === 'dark';
  return (
    <div className={clsx(classes.root, darkMode ? '' : classes.default)}>
      <div className={classes.actionsBlock} data-role="footerBlock">
        {Object.entries(props).map(([key, value]) => (value
          && (
            <Button
              key={`btn_${key}`}
              data-role={`btn_${key}`}
              variant={value.variant}
              className={clsx(
                classes.button,
                classes[key],
                value.hidden ? classes.hidden : '',
                darkMode ? classes.darkMode : '',
              )}
              style={(value.order) ? { order: value.order } : {}}
              onClick={value.action}
              disabled={value.disabled}
            >
              {value.text}
            </Button>
          )
        ))}
      </div>
      <img
        className={classes.poweredBy}
        src={darkMode ? poweredBy : poweredByDark}
        alt="powered by getId"
      />
    </div>
  );
};

MobileFooter.propTypes = {
  back: PropTypes.shape({
    theme: PropTypes.string,
  }).isRequired,
};

export default MobileFooter;
