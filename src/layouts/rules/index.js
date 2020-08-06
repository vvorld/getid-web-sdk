import React, { useContext } from 'react';
import Footer from '../../components/blocks/footer/footer';
import Header from '../../components/blocks/header/header';
import Content from '../../components/blocks/content';
import TranslationsContext from '../../context/TranslationsContext';

import './rules.css';

export const RulesList = ({ children }) => {
  const { translations } = useContext(TranslationsContext);
  const rules = Object.keys(translations).filter((el) => el.includes('PhotoRules_line_')).map((ele) => translations[ele]);
  return (
    <>

      <p className="getid-rule-list">
        {children}
        <ul>
          { rules.map((el) => (
            <li>
              { el }
            </li>
          ))}
        </ul>
      </p>
    </>
  );
};
const Rules = ({ finishStep, prevStep }) => (
  <>
    <Header componentName="PhotoRules" />
    <Content>
      <RulesList />
    </Content>
    <Footer
      next={{ onClick: () => finishStep() }}
      back={{ onClick: () => prevStep() }}
    />
  </>
);

export default Rules;
