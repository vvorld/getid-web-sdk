import { makeStyles } from '@material-ui/core';

const buttonStyles = makeStyles((theme) => ({
  customButton: {
    background: theme.palette.white,
    color: theme.palette.blue.main,
    border: `1px solid ${theme.palette.white}`,
    lineHeight: '14px',
    margin: '26px auto 12px',
    '&:hover': {
      background: 'white',
    },
  },
  makePhotoButton: {
    border: '1px solid #7861A2',
    display: 'inline-block',
    padding: '12px',
    cursor: 'pointer',
    color: '#7861A2',
    boxShadow: 'none',
  },
}));

export default buttonStyles;
