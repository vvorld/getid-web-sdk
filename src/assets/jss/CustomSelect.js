import { makeStyles } from '@material-ui/core';

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
    border: '1px solid rgba(120, 97, 162, 1)',
    boxSizing: 'border-box',
    borderRadius: 8,
    boxShadow: '0px 4px 20px rgba(23, 61, 105, 0.15)',
    color: '#0E1C2C',
    backgroundColor: 'white',
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
      background: 'rgba(120, 97, 162, 0.05)',
    },
  },
  placeholderItem: {
    color: 'rgba(14, 28, 44, 0.5)',
    fontSize: '16px',
    lineHeight: '22px',
    paddingTop: '14px',
    paddingBottom: '14px',
    '&:hover': {
      background: 'rgba(120, 97, 162, 0.05)',
    },
  },
  itemSelected: {
    background: 'rgba(120, 97, 162, 0.05)!important',
    '&:hover': {
      background: 'rgba(120, 97, 162, 0.05)',
    },
  },
  img: {
    width: '15px',
    height: '20px',
  },
  focused: {},
}));

export default CustomSelectStyles;
