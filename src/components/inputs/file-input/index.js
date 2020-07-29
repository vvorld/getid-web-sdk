import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './file-input.css';

/*

setErrorState = (isError, name, errorText) => {
    this.setState((prevState) => ({
      isError: {
        ...prevState.isError,
        [name]: isError,
      },
      errorText: {
        ...prevState.errorText,
        [name]: errorText,
      },
    }));
  }

  handleFiles = async (event) => {
    const eventTarget = event.target;
    const file = [...event.target.files][0];
    if (file && file.size / 1024 / 1024 > 6) {
      this.changeFileData(eventTarget, null);
      this.setErrorState(true, eventTarget.name, 'File size exceeded (max 6mb)');
      return;
    }
    this.changeFileData(eventTarget, file);
    this.setErrorState(false, eventTarget.name, '');
  };

*/
const FileInput = (props) => {
  const {
    onChange, label, value, name, required, placeholder,
  } = props;
  const [currValue, setValue] = useState(value);
  const ph = (placeholder && placeholder + (required ? '*' : '')) || '';
  { /* translations.file_input_tooltip */ }
  return (
    <>
      {label && <label className="getid-form__input-label">{label + (required ? '*' : '')}</label>}
      <label>
        <input
          className="getid-file-input__generic"
          accept="image/x-png,image/jpeg"
          onChange={(e) => {
            const newValue = e.target.value;
            setValue(newValue.split('\\').pop());
            onChange(newValue);
          }}
          type="file"
        />
        <div className="getid-file-input">
          <div className="getid-file-input__label">
            {currValue || (
            <div className="getid-file-input__placeholder">
              {ph}
              &nbsp;
            </div>
            ) }
          </div>
          <div className="getid-file-input__icon" />
        </div>
      </label>
    </>
  );
};

FileInput.propTypes = {
  // type: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  required: PropTypes.bool,
};

FileInput.defaultProps = {
  required: false,
};

export default FileInput;
