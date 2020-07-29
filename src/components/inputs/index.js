import React from 'react';
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

  const changeHandler = (name, type, value) => onChange(name, type, value);
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
        value
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
      onChange={(value) => changeHandler(name, 'text', value)}
      {...other}
    />
  );
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
