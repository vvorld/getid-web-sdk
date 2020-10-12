import React, { useState } from 'react';
import './style.css';
import PropTypes from 'prop-types';
import { getConst } from '~/components/blocks/translations';

const getMonths = (required) => [
  { name: getConst('month') + (required ? '*' : ''), days: 31 },
  { name: getConst('january'), days: 31 },
  { name: getConst('february'), days: 29 },
  { name: getConst('march'), days: 31 },
  { name: getConst('april'), days: 30 },
  { name: getConst('may'), days: 31 },
  { name: getConst('june'), days: 30 },
  { name: getConst('july'), days: 31 },
  { name: getConst('august'), days: 31 },
  { name: getConst('september'), days: 30 },
  { name: getConst('october'), days: 31 },
  { name: getConst('november'), days: 30 },
  { name: getConst('december'), days: 31 },
];
const days = ([...new Array(31)]).map((_, n) => n + 1);
const years = ([...new Array(200)]).map((_, n) => n + 1900);

const getDate = (val) => {
  switch (val) {
    case 'now': return new Date();
    case '100yearsFromNow': {
      return new Date(new Date().setFullYear(new Date().getFullYear() - 100));
    }
    default: return new Date(val);
  }
};

const parseDate = (date) => {
  const parts = (date || '').split('-');
  const [y, m, d] = parts;
  const timestamp = Date.parse(`${y}-${m}-${d}`);
  if (Number.isNaN(timestamp) === false) {
    return [+y, +m, +d];
  }
  return [0, 0, 0];
};

function DateInput({
  required, value, onChange, label, min, max, enableControls,
}) {
  const months = getMonths(required);
  const [y, m, d] = parseDate(value);
  const [monthDays, setDays] = useState(days);

  const [year, setYear] = useState(y);
  const [month, setMonth] = useState(m);
  const [day, setDay] = useState(d);

  const formatYears = () => years
    .filter((el) => el >= getDate(min || '100yearsFromNow')
      .getFullYear() && el <= getDate(max || 'now')
      .getFullYear());

  const changeDate = (yr, mth, dy) => {
    if (yr && mth && dy) {
      const date = `${yr}-${mth}-${dy}`;
      onChange(date, false);
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
      const daysInMonth = months[(mth || 1)].days;

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
  const dayLabel = `${getConst('day')}${required ? '*' : ''}`;
  const yearLabel = `${getConst('year')}${required ? '*' : ''}`;

  const paste = async () => {
    const text = await navigator.clipboard.readText();
    const [yy, mm, dd] = parseDate(text);
    if (yy !== 0 && mm !== 0 && dd !== 0) {
      setYear(yy);
      setMonth(mm);
      setDay(dd);
    }
  };
  return (
    <>
      {label && (
      <label className="getid-form__input-label" data-role="date-label">
        {label}
        {enableControls && <span role="button" tabIndex="0" className="getid-form__input-action" onClick={paste}>Paste</span>}
      </label>
      )}

      <div className="getid-form__date-input" data-role="date-block">
        <select data-role="day" value={day} onChange={(e) => change(undefined, undefined, +e.target.value)}>
          <option value="0">{dayLabel}</option>
          {monthDays.map((x) => <option key={x} value={x}>{x}</option>)}
        </select>
        <select data-role="month" value={month} onChange={(e) => change(undefined, +e.target.value, undefined)}>
          {months.map((x, n) => <option key={x.name} value={n}>{x.name}</option>)}
        </select>
        <select data-role="year" value={year} onChange={(e) => change(+e.target.value, undefined, undefined)}>
          <option value="0">{yearLabel}</option>
          {formatYears().map((x) => <option key={x} value={x}>{x}</option>)}
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
  min: PropTypes.any,
  max: PropTypes.any,
  enableControls: PropTypes.bool,
};

DateInput.defaultProps = {
  value: '',
  required: false,
  onChange: null,
  label: '',
  min: null,
  max: null,
  enableControls: false,
};

export default DateInput;
