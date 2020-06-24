import React from 'react';
import PropTypes from 'prop-types';

import css from './style.css';

function DateInput(props) {
  return (
    <div className={css.date}>
      <select name="day" id="day" className="day" required="">
        <option value="default" disabled="" selected="">Day*</option>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
      </select>
      <select name="month" id="month" required="">
        <option value="default" disabled="" selected="">Month*</option>
        <option value="jan">January</option>
        <option value="feb">February</option>
        <option value="mar">March</option>
      </select>
      <select name="year" id="year" required="">
        <option value="default" disabled="" selected="">Year*</option>
        <option value="">2002</option>
        <option value="">2001</option>
        <option value="">2000</option>
        <option value="">1999</option>
        <option value="">1998</option>
        <option value="">1997</option>
      </select>
    </div>
  );
}

DateInput.propTypes = {
  value: PropTypes.any,
};

DateInput.defaultProps = {
  value: '',
};

export default DateInput;
