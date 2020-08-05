import React from 'react';
import Footer from '../../components/blocks/footer/footer';
import Header from '../../components/blocks/header/header';

// next={{ onClick: () => finishStep(this.form), disable: this.isDisabled() }}
//              back={{ onClick: prevStep }}
const Rules = ({ translations, finishStep, prevStep }) => {
  const rules = Object.keys(translations).filter((el) => el.includes('PhotoRules_line_')).map((ele) => translations[ele]);

  return (
    <>
      <Header componentName="PhotoRules" />
      <div>
        <p className="getid-header__small getid-list">
          <ul>
            { rules.map((el) => (
              <li>
                { el }
              </li>
            ))}
          </ul>
        </p>
      </div>

      <Footer
        next={{ onClick: () => finishStep() }}
        back={{ onClick: () => prevStep() }}
      />
    </>

  );
};

export default Rules;
