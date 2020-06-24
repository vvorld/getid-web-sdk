import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import TranslationsContext from '../../../context/TranslationsContext';
import css from './file-input.css';
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
        className={css.fileInput}
        accept="image/x-png,image/jpeg"
        onChange={(e) => {
          const newValue = e.target.value;
          setValue(newValue.split('\\').pop());
          onChange(newValue);
        }}
        type="file"
      />
      <inputbox className={css.fakeFileInput}>
        <div className={css.label}>
          {currValue || <placeholder>{placeholder}</placeholder> }
        </div>
        <div className={css.fileIcon}>
          <img src={fileIcon} />
        </div>
      </inputbox>
    </label>
  );
};

FileInput.propTypes = {
  type: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  required: PropTypes.bool,
};

FileInput.defaultProps = {
  required: false,
};

export default FileInput;
