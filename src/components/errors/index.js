import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import TranslationsContext from '~/context/TranslationsContext';
import ErrorIcon from '~/assets/icons/views/error-icon.svg';
import Browsers from './browsers';
import Footer from '~/components/blocks/footer';
import Header from '~/components/blocks/header/header';
import Content from '~/components/blocks/content';

const createErrorView = (config) => (props) => {
  const {
    error, onRetry, onCancel,
  } = props;

  const { translations: dictionary } = useContext(TranslationsContext);

  return (
    <>
      <Header step={`${error}_error`} />
      <Content step={`${error}_error`}>
        <div><img alt="error" src={ErrorIcon} /></div>

        {/*
        const { abilityToSwitch } = config;
        const switchDevice = () => {};
        abilityToSwitch && (
          <div style={{ margin: '10px auto' }}>
            <button className="getid-button__main" type="button" onClick={switchDevice}>
              Change device and continue
            </button>
          </div>
          ) */}
        {config.children && config.children(dictionary)}

      </Content>

      <Footer
        step="error"
        next={{ onClick: onRetry }}
        back={{ onClick: onCancel }}
      />

    </>
  );
};

const errorProps = {
  condition: PropTypes.string,
  callbacks: PropTypes.object,
};

export const ErrorView = createErrorView({
  abilityToSwitch: true,
});

export const BrowserNotSupportedErrorView = createErrorView({
  children: (dictionary) => <Browsers dictionary={dictionary} />,
  abilityToSwitch: true,
});

ErrorView.props = errorProps;
BrowserNotSupportedErrorView.props = errorProps;
