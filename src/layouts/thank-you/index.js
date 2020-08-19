import React from 'react';
import PropTypes from 'prop-types';
import ThankYouIcon from '../../assets/icons/thank-you-logo.svg';
import Header from '../../components/blocks/header/header';
import Footer from '../../components/blocks/footer/footer';
import Content from '../../components/blocks/content';

const ThankYou = (props) => (
  <>
      <div>
          <img data-role="logo" className="getid-logo__top" src={ThankYouIcon} alt="logo" />
      </div>
    <Header componentName="ThankYou" />
    <Footer next={{ onClick: props.finishStep }} />
  </>
);

ThankYou.propTypes = {
  finishStep: PropTypes.func,
};
ThankYou.defaultProps = {
  finishStep: null,
};

export default ThankYou;
