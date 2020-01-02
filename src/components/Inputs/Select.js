import React from 'react';
import Icon from '@material-ui/core/Icon';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

import arrowIcon from '../../assets/images/components/arrow.svg';

const useStyles = makeStyles(() => ({
  customSelect: {
    color: 'rgba(14, 28, 44, 0.5)',
    backgroundColor: 'transparent',
    textAlign: 'left',
    height: 58,
    borderRadius: 8,
    border: '1px solid rgba(120, 97, 162, 0.4)',
    '&& div': {
      backgroundColor: 'transparent',
      fontSize: 16,
    },
    '&.filled': {
      color: 'rgba(14, 28, 44, 1)',
      border: '1px solid #7861A2',
    },
    '&& fieldset': {
      backgroundColor: 'transparent',
      border: 0,
    },
    '&:focus': {
      border: '1px solid #7861A2',
      color: '#0E1C2C',
      backgroundColor: '#fff',
    },
  },
  dropdownStyle: {
    border: '1px solid rgba(120, 97, 162, 1)',
    boxSizing: 'border-box',
    borderRadius: 8,
    boxShadow: ' 0px 4px 20px rgba(23, 61, 105, 0.15)',
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

const CustomSelect = (props) => {
  const {
    items, onChange, value, name, placeholder,
  } = props;

  const classes = useStyles();
  const className = value ? ' filled' : '';

  const selectIcon = () => (
    <Icon className={classes.icon}>
      <img className={classes.img} alt="open select" src={arrowIcon} />
    </Icon>
  );

  return (
    <FormControl fullWidth variant="outlined">
      <Select
        data-role="select"
        MenuProps={{
          MenuListProps: { disablePadding: true },
          classes: { paper: classes.dropdownStyle },
        }}
        className={classes.customSelect + className}
        displayEmpty
        name={name}
        value={value}
        onChange={onChange}
        IconComponent={selectIcon}
      >
        <MenuItem
          classes={{
            root: classes.placeholderItem,
            selected: classes.itemSelected,
          }}
          value=""
        >
          {placeholder}
        </MenuItem>
        {items.map((item) => (
          <MenuItem
            classes={{
              root: classes.item,
              selected: classes.itemSelected,
            }}
            value={item.value}
            key={item.name}
          >
            {item.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

CustomSelect.propTypes = {
  value: PropTypes.any,
  items: PropTypes.array,
  onChange: PropTypes.func,
  name: PropTypes.string,
  placeholder: PropTypes.string,
};

CustomSelect.defaultProps = {
  value: '',
  items: [],
  onChange: null,
  name: '',
  placeholder: '',
};

export default CustomSelect;
