/* eslint-disable max-classes-per-file */
import React, { useState, useEffect } from 'react';

const normalizeNumber = (n) => (n < 10 ? `0${n}` : `${n}`);
const Timer = () => {
  const [time, updateTime] = useState(0);
  useEffect(() => {
    setTimeout(
      () => updateTime(time + 1),
      1000,
    );
  });
  return (
    <div className="getid-timer_contaner">
      <div className="getid-timer_dot" />
      {`${normalizeNumber(Math.floor(time / 60))}:${normalizeNumber(Math.round(time % 60))}`}
    </div>
  );
};

export default Timer;
