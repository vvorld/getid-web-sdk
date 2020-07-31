import React, { useState } from 'react';
import './style.css';
import PropTypes from 'prop-types';

const months = [
  { name: 'January', days: 31 },
  { name: 'February', days: 29 },
  { name: 'March', days: 31 },
  { name: 'April', days: 30 },
  { name: 'May', days: 31 },
  { name: 'June', days: 30 },
  { name: 'July', days: 31 },
  { name: 'August', days: 31 },
  { name: 'September', days: 30 },
  { name: 'October', days: 31 },
  { name: 'November', days: 30 },
  { name: 'December', days: 31 },
];
const days = ([...new Array(31)]).map((_, n) => n + 1);
const years = ([...new Array(200)]).map((_, n) => n + 1900);

const parseDate = (date) => {
  const parts = (date || '').split('-');
  const [y, m, d] = parts;
  const timestamp = Date.parse(`${y}-${m}-${d}`);
  if (isNaN(timestamp) === false) {
    return [+y, +m, +d];
  }
  return [0, 0, 0];
};
function DateInput({
  required, value, onChange, label,
}) {
  const [y, m, d] = parseDate(value);
  const [monthDays, setDays] = useState(days);

  const [year, setYear] = useState(y);
  const [month, setMonth] = useState(m);
  const [day, setDay] = useState(d);
  const changeDate = (yr, mth, dy) => {
    if (yr && mth && dy) {
      const date = `${yr}-${mth}-${dy}`;
      onChange(date);
    }
  };
  const normaliseDays = (yr, mth) => {
    if (mth !== 0) {
      if (mth === 2 && yr && yr % 4 !== 0) {
        setDays(days.slice(0, 28));
        if (day > 28) {
          setDay(0);
        }
        return;
      }
      const daysInMonth = months[m - 1].days;
      if (day > daysInMonth) {
        setDay(0);
      }
      setDays(days.slice(0, daysInMonth));
      return;
    }
    setDays(days);
  };
  const change = (yr, mth, dy) => {
    if (yr !== undefined) {
      setYear(yr);
      normaliseDays(yr, month);
      changeDate(yr, month, day);
    } else if (mth !== undefined) {
      setMonth(mth);
      normaliseDays(year, mth);
      changeDate(year, mth, day);
    } else if (dy !== undefined) {
      setDay(dy);
      changeDate(year, month, dy);
    }
  };
  const dayLabel = `Day${required ? '*' : ''}`;
  const monthLabel = `Month${required ? '*' : ''}`;
  const yearLabel = `Year${required ? '*' : ''}`;
  return (
    <>
      {label && <label className="getid-form__input-label">{label}</label>}
      <div className="getid-form__date-input">
        <select value={day} onChange={(e) => change(undefined, undefined, +e.target.value)}>
          <option value="0">{dayLabel}</option>
          {monthDays.map((x) => <option key={x} value={x}>{x}</option>)}
        </select>
        <select value={month} onChange={(e) => change(undefined, +e.target.value, undefined)}>
          <option value="0">{monthLabel}</option>
          {months.map((x, n) => <option key={x.name} value={n + 1}>{x.name}</option>)}
        </select>
        <select value={year} onChange={(e) => change(+e.target.value, undefined, undefined)}>
          <option value="0">{yearLabel}</option>
          {years.map((x) => <option key={x} value={x}>{x}</option>)}
        </select>
      </div>
    </>
  );
}

DateInput.propTypes = {
  value: PropTypes.string,
  required: PropTypes.bool,
  onChange: PropTypes.func,
  label: PropTypes.string,
};

DateInput.defaultProps = {
  value: '',
  required: false,
  onChange: null,
  label: '',
};

export default DateInput;
