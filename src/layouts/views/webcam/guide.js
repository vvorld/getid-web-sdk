import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core';
import { isMobile } from '../../../helpers/generic';
import { getFormValues } from '../../../store/selectors';

const AnimatedSvg = {
  front: 'https://getid-storage.fra1.cdn.digitaloceanspaces.com/assets/desktop/default_front.svg',
  back: 'https://getid-storage.fra1.cdn.digitaloceanspaces.com/assets/desktop/default_back.svg',
  passport: 'https://getid-storage.fra1.cdn.digitaloceanspaces.com/assets/desktop/passport.svg',
  frontMobile: 'https://getid-storage.fra1.cdn.digitaloceanspaces.com/assets/mobile/default_front.svg',
  backMobile: 'https://getid-storage.fra1.cdn.digitaloceanspaces.com/assets/mobile/default_back.svg',
  passportMobile: 'https://getid-storage.fra1.cdn.digitaloceanspaces.com/assets/mobile/passport.svg',
  selfieMobile: 'https://getid-storage.fra1.cdn.digitaloceanspaces.com/assets/mobile/selfie.svg',
  selfie: 'https://getid-storage.fra1.cdn.digitaloceanspaces.com/assets/desktop/selfie.svg',
};

const useStyles = makeStyles((theme) => ({
  guide: {
    border: `1px solid ${theme.palette.violet.main}`,
    borderRadius: 8,
    maxHeight: 'calc(50vh)',
    maxWidth: '75%',
  },
}));

const Guide = ({ component }) => {
  const fieldValues = useSelector((state) => getFormValues(state));
  const classes = useStyles();

  const isPassport = !!Object.values(fieldValues)
    .find(({ DocumentType }) => (DocumentType && DocumentType.value === 'passport'));

  const source = () => {
    if (component === 'selfie') {
      return AnimatedSvg[`${component}${isMobile() ? 'Mobile' : ''}`];
    }
    return AnimatedSvg[`${isPassport ? 'passport' : component}${isMobile() ? 'Mobile' : ''}`];
  };


  return (
    <object type="image/svg+xml" className={classes.guide} data={source()} aria-label={`${component}_guide`} />
  );
};

Guide.propTypes = {
  component: PropTypes.string.isRequired,
};

export default Guide;
