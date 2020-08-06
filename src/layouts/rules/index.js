import React from 'react';
import Footer from '../../components/blocks/footer/footer';
import Header from '../../components/blocks/header/header';
import Content from '../../components/blocks/content';
import './rules.css';

export const RulesList = ({ translations, children }) => {
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
const Rules = ({ translations, finishStep, prevStep }) => (
  <>
    <Header componentName="PhotoRules" />
    <Content>
      <RulesList translations={translations} />
    </Content>
    <Footer
      next={{ onClick: () => finishStep() }}
      back={{ onClick: () => prevStep() }}
    />
  </>
);

export default Rules;
