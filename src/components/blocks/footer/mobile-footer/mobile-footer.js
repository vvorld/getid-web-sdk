import React from 'react';
import clsx from 'clsx';
import Button from '@material-ui/core/Button';
import FooterStyles from './style';
import poweredBy from '../../../../assets/icons/views/poweredby-mobile.svg';
import poweredByDark from '../../../../assets/icons/views/poweredby-mobile-dark.svg';

const MobileFooter = (props) => {
  const classes = FooterStyles();
  const darkMode = props.back && props.back.theme === 'dark';
  return (
    <div className={classes.root}>
      <div className={classes.actionsBlock} data-role="footerBlock">
        {Object.entries(props).map(([key, value]) => (value
          && (
            <Button
              data-role={`btn_${key}`}
              variant={value.variant}
              className={clsx(
                classes.button,
                classes[key],
                value.hidden ? 'hidden' : '',
                darkMode ? classes.darkMode : '',
              )}
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
};

export default MobileFooter;
