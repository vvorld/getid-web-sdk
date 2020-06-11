import { makeStyles } from '@material-ui/core';

const CustomSelectStyles = makeStyles((theme) => ({
  customSelect: {
    ...theme.typography.mainInput,
  },
  dropdownStyle: {
    ...theme.inputBorder,
  },
  icon: {
    position: 'absolute',
    right: 10,
    display: 'flex',
    alignItems: 'center',
    pointerEvents: 'none',
  },
  item: {
    ...theme.typography.mainInput,
    paddingTop: '14px',
    paddingBottom: '14px',
    '&:hover': {
      backgroundColor: theme.palette.violet.light,
    },
  },
  labelRoot: {
    paddingLeft: '5px',
    paddingRight: '5px',
    ...theme.typography.label,
    opacity: '1!important',
  },
  itemSelected: {
    background: `${theme.palette.violet.light}!important`,
    '&:hover': {
      backgroundColor: theme.palette.violet.light,
    },
  },
  img: {
    width: '15px',
    height: '20px',
  },
}));

export default CustomSelectStyles;
