import React from 'react';
import PropTypes from 'prop-types';
import { RulesList } from '../../rules';
import Translate from '../../../components/blocks/translations';
import './retake.css';

const RetakeDescription = ({ code, step, rules }) => (
  <div>
    <div className="getid-retake_message">
      <Translate step={step} element={code} />
    </div>

    <RulesList step={rules} />
  </div>
);

RetakeDescription.propTypes = {
  message: PropTypes.string.isRequired,
};

export default RetakeDescription;
