import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
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
    onChange, label, value, name,
  } = props;
  const [currValue, setValue] = useState(value);
  const { translations } = useContext(TranslationsContext);
  return (

    <div>
      {/* translations.file_input_tooltip */}

      <label style={{ display: 'block', width: '100%' }}>
        <input
          style={{
            width: '0.1px',
            height: '0.1px',
            opacity: 0,
            overflow: 'hidden',
            position: 'absolute',
            zIndex: -1,
          }}
          // value={currValue}
          accept="image/x-png,image/jpeg"
          onChange={(e) => {
            const newValue = e.target.value;
            setValue(newValue);
            onChange(newValue);
          }}
          type="file"
        />
        <div
          style={{
            position: 'relative',
            overflow: 'hidden',
            display: 'inline-block',
            width: '100%',
            padding: '10px',
            paddingRight: '35px',
            border: 'solid 1px',
            overflow: 'hidden',
            boxSizing: 'border-box',
            textOverflow: 'ellipsis',
            background: 'rgb(250, 250, 252)',
          }}
          className="file"
        >

          {currValue || label }
          <svg style={{ position: 'absolute', right: '10px', top: '10px' }} width="20" height="19" viewBox="0 0 20 19" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16.125 8.25H17C18.1046 8.25 19 9.14543 19 10.25V16.25C19 17.3546 18.1046 18.25 17 18.25H3C1.89543 18.25 1 17.3546 1 16.25V8.25C1 7.14543 1.89543 6.25 3 6.25H4.31431C4.98394 6.25 5.60915 6.58513 5.97986 7.14278L6.12241 7.35722C6.49313 7.91487 7.11833 8.25 7.78797 8.25H8.875" stroke="#7861A2" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="12.5" y1="11.5" x2="12.5" y2="2.5" stroke="#7861A2" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M15.1805 4.18198L12.499 1.50049L9.81753 4.18198" stroke="#7861A2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </label>
    </div>
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
