import React, { useState } from 'react';
import './style.css';

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
function DateInput({ required, value, onChange }) {
  const [y, m, d] = parseDate(value);
  const [monthDays, setDays] = useState(days);

  const [year, setYear] = useState(y);
  const [month, setMonth] = useState(m);
  const [day, setDay] = useState(d);
  const changeDate = (y, m, d) => {
    if (y && m && d) {
      const date = `${y}-${m}-${d}`;
      onChange(date);
    }
  };
  const normaliseDays = (y, m) => {
    if (m !== 0) {
      if (m === 2 && y && y % 4 !== 0) {
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
  const change = (y, m, d) => {
    if (y !== undefined) {
      setYear(y);
      normaliseDays(y, month);
      changeDate(y, month, day);
    } else if (m !== undefined) {
      setMonth(m);
      normaliseDays(year, m);
      changeDate(year, m, day);
    } else if (d !== undefined) {
      setDay(d);
      changeDate(year, month, d);
    }
  };
  const dayLabel = `Day${required ? '*' : ''}`;
  const monthLabel = `Month${required ? '*' : ''}`;
  const yearLabel = `Year${required ? '*' : ''}`;
  return (
    <div className="getid-date-input">
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
  );
}

DateInput.defaultProps = {
  value: '',
};

export default DateInput;
