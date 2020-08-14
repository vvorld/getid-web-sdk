import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import './file-input.css';
import TranslationsContext from '../../../context/TranslationsContext';

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
  const [error, setError] = useState(null);
  const ph = (placeholder && placeholder + (required ? '*' : '')) || '';
  const { translations } = useContext(TranslationsContext);

  const validate = (file) => {
    if (file && file.size / 1024 / 1024 > 6) {
      setError('File size exceeded (max 6mb)');
      setValue(null);
    }
  };
  return (
    <>
      {label && <label className="getid-form__input-label">{label + (required ? '*' : '')}</label>}
      <div className="getid-form__input-tooltip">{ translations.file_input_tooltip }</div>
      <label>
        <input
          className="getid-file-input__generic"
          accept="image/x-png,image/jpeg"
          onChange={(e) => {
            const file = [...e.target.files][0];
            setValue(file.name);
            onChange(file);
            validate(file);
          }}
          name={name}
          type="file"
        />
        <div className={`getid-file-input ${error && 'getid-input-error'}`}>
          <div className="getid-file-input__label">
            {currValue || (
              <div className="getid-file-input__placeholder">
                {ph}
              &nbsp;
              </div>
            ) }
          </div>
          <svg className="getid-file-input__icon" width="20" height="19" viewBox="0 0 20 19" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16.125 8.25H17C18.1046 8.25 19 9.14543 19 10.25V16.25C19 17.3546 18.1046 18.25 17 18.25H3C1.89543 18.25 1 17.3546 1 16.25V8.25C1 7.14543 1.89543 6.25 3 6.25H4.31431C4.98394 6.25 5.60915 6.58513 5.97986 7.14278L6.12241 7.35722C6.49313 7.91487 7.11833 8.25 7.78797 8.25H8.875" stroke="#8D99B0" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="12.5" y1="11.5" x2="12.5" y2="2.5" stroke="#8D99B0" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M15.1805 4.18198L12.499 1.50049L9.81753 4.18198" stroke="#8D99B0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </label>
      {error && <span className="getid-error__message">{error }</span>}
    </>
  );
};

FileInput.propTypes = {
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  name: PropTypes.string,
  value: PropTypes.string,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
};

FileInput.defaultProps = {
  required: false,
  name: '',
  value: '',
  placeholder: '',
};

export default FileInput;
