import React, { useState } from 'react';
import './content.css';

const Content = ({ children, step, disableAnmation }) => {
  const [{ visible, step: st }, setVisible] = useState({ visible: false, step });
  const enableAnimation = (!visible || step !== st) && !disableAnmation;
  if (enableAnimation) {
    setTimeout(() => {
      setVisible({ visible: true, step });
    }, 50);
  }
  return (
    <div className={`getid-content__container getid-animation${!enableAnimation ? ' getid-visible_2' : ''}`}>
      {children}
    </div>
  );
};

export default Content;
