import { fade, makeStyles } from '@material-ui/core';

const CustomSelectStyles = makeStyles((theme) => ({
  customSelect: {
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
    color: theme.palette.deepBlue,
    backgroundColor: 'transparent',
    textAlign: 'left',
    height: 58,
    borderRadius: 8,
    border: `1px solid ${theme.palette.violet}`,
    '&& div': {
      backgroundColor: 'transparent',
      fontSize: 16,
    },
    '&.filled': {
      color: theme.palette.deepBlue,
      border: `1px solid ${theme.palette.violet}`,
    },
    '&& fieldset': {
      backgroundColor: 'transparent',
      border: 0,
    },
    '&:focus': {
      border: `1px solid ${theme.palette.violet}`,
      color: theme.palette.deepBlue,
      backgroundColor: theme.palette.white,
    },
  },
  dropdownStyle: {
    border: `1px solid ${theme.palette.violet}`,
    boxSizing: 'border-box',
    borderRadius: 8,
    boxShadow: `0px 4px 20px ${fade(theme.palette.blue, 0.15)}`,
    color: theme.palette.deepBlue,
    backgroundColor: theme.palette.white,
  },
  icon: {
    position: 'absolute',
    right: 10,
    top: '35%',
    pointerEvents: 'none',
  },
  item: {
    fontSize: '16px',
    lineHeight: '22px',
    paddingTop: '14px',
    paddingBottom: '14px',
    '&:hover': {
      background: `${fade(theme.palette.violet, 0.05)}`,
    },
  },
  placeholderItem: {
    color: `${fade(theme.palette.deepBlue, 0.5)}`,
    fontSize: '16px',
    lineHeight: '22px',
    paddingTop: '14px',
    paddingBottom: '14px',
    '&:hover': {
      background: `${fade(theme.palette.violet, 0.05)}`,
    },
  },
  itemSelected: {
    background: `${fade(theme.palette.violet, 0.05)}!important`,
    '&:hover': {
      background: `${fade(theme.palette.violet, 0.05)}`,
    },
  },
  img: {
    width: '15px',
    height: '20px',
  },
  focused: {},
}));

export default CustomSelectStyles;
