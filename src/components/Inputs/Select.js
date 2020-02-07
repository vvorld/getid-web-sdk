import React from 'react';
import Icon from '@material-ui/core/Icon';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import PropTypes from 'prop-types';

import arrowIcon from '../../assets/icons/views/arrow-down.svg';
import CustomSelectStyles from '../../assets/jss/components/inputs/CustomSelect';

const CustomSelect = (props) => {
  const {
    items, onChange, value, name, placeholder, required,
  } = props;

  const classes = CustomSelectStyles();
  const className = value ? ' filled' : '';

  const selectIcon = () => (
    <Icon className={classes.icon}>
      <img className={classes.img} alt="open select" src={arrowIcon} />
    </Icon>
  );

  console.log(required)
  return (
    <FormControl required={required} fullWidth variant="filled">
        <InputLabel id="demo-simple-select-required-label">{placeholder}</InputLabel>
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
        {/*<MenuItem*/}
        {/*  classes={{*/}
        {/*    root: classes.placeholderItem,*/}
        {/*    selected: classes.itemSelected,*/}
        {/*  }}*/}
        {/*  value=""*/}
        {/*>*/}
        {/*</MenuItem>*/}
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
