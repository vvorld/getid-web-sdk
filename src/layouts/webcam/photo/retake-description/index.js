import React from 'react';
import PropTypes from 'prop-types';
import { RulesList } from '../../../rules';
import Translate from '~/components/blocks/translations';
import './retake.css';

const RetakeDescription = ({ code, step, rules }) => (
  <div>
    <div className="getid-retake_message">
      <Translate step={step} element={code || 'error'} />
    </div>

    <RulesList rules={rules} />
  </div>
);

RetakeDescription.propTypes = {
  code: PropTypes.string.isRequired,
  step: PropTypes.string.isRequired,
  rules: PropTypes.string.isRequired,
};

export default RetakeDescription;
