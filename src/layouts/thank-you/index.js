import React from 'react';
import ThankYouIcon from '../../assets/icons/thank-you-logo.svg';
import Header from '../../components/blocks/header/header';
import Footer from '../../components/blocks/footer/footer';

const ThankYou = (props) => {
  console.log(props.finishStep);
  return (
    <div>
      <img data-role="logo" className="getid-logo__top" src={ThankYouIcon} alt="logo" />
      <Header componentName={props.componentName} />
      <Footer
        next={{ onClick: props.finishStep }}
      />
    </div>
  );
};

export default ThankYou;
