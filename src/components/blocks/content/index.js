import React, { useState } from 'react';
import './content.css';
import { node, string, bool } from 'prop-types';

const Content = ({ children, step, disableAnimation }) => {
  const [{ visible, step: st }, setVisible] = useState({ visible: false, step });
  const enableAnimation = (!visible || step !== st) && !disableAnimation;
  if (enableAnimation) {
    setTimeout(() => {
      setVisible({ visible: true, step });
    }, 50);
  }
  return (
    <div data-role="content"
         className={`getid-content__container getid-animation${!enableAnimation ? ' getid-visible_2' : ''}`}>
      {children}
    </div>
  );
};

Content.propTypes = {
  children: node.isRequired,
  step: string,
  disableAnimation: bool,
};
Content.defaultProps = {
  disableAnimation: false,
  step: '',
};
export default Content;
