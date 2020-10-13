import React, { Component } from 'react';

import propTypes from 'prop-types';
import ContinueOnPhone from '~/assets/icons/continue-on-phone.svg';

import Footer from '~/components/blocks/footer';
import Header from '~/components/blocks/header/header';
import Content from '~/components/blocks/content';
import { RulesList } from '~/layouts/rules';

import MagicLink from './magic-link';

class ChangeDevice extends Component {
  constructor(props) {
    super(props);
    this.state = {
      step: 'rules',
    };
  }

  render() {
    const { step } = this.state;
    if (step === 'rules') {
      return (
        <>
          <Header step="ChangeDevice" />
          <Content step="ChangeDevice">
            <img
              alt="continue"
              style={{ margin: '20px' }}
              src={ContinueOnPhone}
            />
            <RulesList rules="ChangeDevice" numeric />
          </Content>
          <Footer
            step="ChangeDevice"
            next={{ onClick: () => { this.setState({ step: 'link' }); } }}
            back={{ onClick: this.props.onBack }}
          />

        </>
      );
    }
    return <MagicLink config={this.props.config} onBack={() => this.setState({ step: 'rules' })} />;
  }
}

ChangeDevice.propTypes = {
  config: propTypes.shape({}),
  onBack: propTypes.func,
};

ChangeDevice.defaultProps = {
  config: {},
  onBack: null,
};

export default ChangeDevice;
