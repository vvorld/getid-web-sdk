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
    type, name, onChange, required, ...other
  } = props;

  const changeHandler = (nm, tp, val, req) => onChange(nm, tp, val, req);

  if (type === 'select') {
    return (
      <Select
        onChange={(value) => changeHandler(name, 'select', value)}
        {...other}
      />
    );
  }

  if (type === 'file') {
    return (
      <FileInput
        onChange={(value) => changeHandler(name, 'file', value)}
        {...other}
      />
    );
  }

  if (type === 'checkbox') {
    return (
      <Checkbox
        onChange={(value) => changeHandler(name, 'checkbox', value)}
        {...other}
      />
    );
  }
  if (type === 'date') {
    return (
      <DateInput
        onChange={(value) => changeHandler(name, 'date', value)}
        {...other}
      />
    );
  }
  return (
    <Input
      onChange={(value) => changeHandler(name, 'text', value, required)}
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
