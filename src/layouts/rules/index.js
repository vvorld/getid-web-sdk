import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import Footer from '~/components/blocks/footer';
import Header from '~/components/blocks/header/header';
import Content from '~/components/blocks/content';
import TranslationsContext from '~/context/TranslationsContext';

import './rules.css';

export const RulesList = ({ rules, numeric }) => {
  const { translations } = useContext(TranslationsContext);
  const list = Object.keys(translations).filter((el) => el.includes(`${rules}_line_`)).map((ele) => translations[ele]);

  const renderList = list.map((el) => (
    <li key={el}>
      { el }
    </li>
  ));
  return (
    <div className="getid-rule-list_container" data-role="rules">
      {numeric
        ? <ol className="getid-rule-list">{renderList}</ol>
        : <ul className="getid-rule-list">{renderList}</ul>}

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

RulesList.propTypes = {
  rules: PropTypes.string.isRequired,
};
Rules.propTypes = {
  finishStep: PropTypes.func.isRequired,
  prevStep: PropTypes.func.isRequired,
  step: PropTypes.string.isRequired,
};

export default Rules;
