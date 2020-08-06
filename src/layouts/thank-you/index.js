import React from 'react';
import ThankYouIcon from '../../assets/icons/thank-you-logo.svg';
import Header from '../../components/blocks/header/header';
import Footer from '../../components/blocks/footer/footer';
import Content from '../../components/blocks/content';

const ThankYou = (props) => (
  <>
    <Header componentName="ThankYou" />
    <Content>
      <img data-role="logo" className="getid-logo__top" src={ThankYouIcon} alt="logo" />
    </Content>
    <Footer next={{ onClick: props.finishStep }} />
  </>
);

export default ThankYou;
