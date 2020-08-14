import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { RulesList } from '../../rules';
import TranslationsContext from '../../../context/TranslationsContext';

import './retake.css';

const RetakeDescription = ({ message }) => {
  const { translations } = useContext(TranslationsContext);

  return (
    <div>
      <RulesList translations={translations}>
        <div className="getid-retake_message">{message}</div>
        <div>Please, check next rules:</div>
      </RulesList>
    </div>
  );
};

RetakeDescription.propTypes = {
  message: PropTypes.string.isRequired,
};

export default RetakeDescription;
