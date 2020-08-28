import React from 'react';
import PropTypes from 'prop-types';
import DateInput from './date-input';
import Checkbox from './checkbox';
import RadioButton from './radio-button';
import FileInput from './file-input';
import Select from './select';
import Input from './input';

const InputRenderer = (props) => {
  const {
    type, name, onChange, ...other
  } = props;

  const changeHandler = (nm, tp, val, req, inv) => onChange(nm, tp, val, req, inv);

  if (type === 'select') {
    return (
      <Select
        onChange={(val, invalid) => changeHandler(name, 'select', val, other.required, invalid)}
        {...other}
      />
    );
  }

  if (type === 'file') {
    return (
      <FileInput
        onChange={(val, invalid) => changeHandler(name, 'file', val, other.required, invalid)}
        {...other}
      />
    );
  }

  if (type === 'consent' || type === 'bool') {
    return (
      <Checkbox
        onChange={(val, invalid) => changeHandler(name, 'checkbox', val, other.required || type === 'consent', invalid)}
        {...other}
      />
    );
  }
  if (type === 'date') {
    return (
      <DateInput
        onChange={(val, invalid) => changeHandler(name, 'date', val, other.required, invalid)}
        {...other}
      />
    );
  }
  return (
    <Input
      onChange={(val, invalid) => changeHandler(name, 'text', val, other.required, invalid)}
      {...other}
    />
  );
};

InputRenderer.propTypes = {
  type: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func,
};

InputRenderer.defaultProps = {
  type: '',
  name: '',
  onChange: null,
};

export {
  DateInput,
  Checkbox,
  RadioButton,
  FileInput,
  Select,
  Input,
  InputRenderer,
};
