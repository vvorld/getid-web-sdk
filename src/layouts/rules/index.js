import React, { useContext } from 'react';
import Footer from '../../components/blocks/footer/footer';
import Header from '../../components/blocks/header/header';
import Content from '../../components/blocks/content';
import TranslationsContext from '../../context/TranslationsContext';

import './rules.css';
import PropTypes from 'prop-types';

export const RulesList = ({ rules }) => {
  const { translations } = useContext(TranslationsContext);
  const list = Object.keys(translations).filter((el) => el.includes(`${rules}_line_`)).map((ele) => translations[ele]);

  return (
    <div className="getid-rule-list_container">
      <ul className="getid-rule-list">
        { list.map((el) => (
          <li key={el}>
            { el }
          </li>
        ))}
      </ul>
    </div>
  );
};
const Rules = ({ finishStep, prevStep, step }) => (
  <>
    <Header step={step} />
    <Content step={step}>
      <RulesList rules={step} />
    </Content>
    <Footer
      step={step}
      next={{ onClick: () => finishStep() }}
      back={{ onClick: () => prevStep() }}
    />
  </>
);

Rules.propTypes = {
  finishStep: PropTypes.func.isRequired,
  prevStep: PropTypes.func.isRequired,
  step: PropTypes.string.isRequired,
};

export default Rules;
