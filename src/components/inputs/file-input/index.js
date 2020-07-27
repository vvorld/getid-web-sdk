import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import TranslationsContext from '../../../context/TranslationsContext';
import './file-input.css';
import fileIcon from '../../../assets/icons/file.svg';
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
    onChange, label, value, name, required,
  } = props;
  const [currValue, setValue] = useState(value);
  const { translations } = useContext(TranslationsContext);
  { /* translations.file_input_tooltip */ }
  const placeholder = label + (required ? '*' : '');
  return (
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
          {currValue || <div className="getid-file-input__placeholder">{placeholder}</div> }
        </div>
        <div className="getid-file-input__icon">
          <img src={fileIcon} />
        </div>
      </div>
    </label>
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
