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
    error, onRetry, onCancel, failCallback,
  } = props;

  // const { switchDevice } = useContext(TranslationsContext);
  // && 'changedevice_button'
  return (
    <>
      <Header step={`${error}_error`} />
      <Content step={`${error}_error`}>
        {config.children
          ? config.children()
          : <div><img alt="error" src={ErrorIcon} /></div> }

      </Content>
      <Footer
        step="error"
        next={{
          onClick: onRetry || failCallback,
          translate: onRetry ? 'error_next' : 'error_finish',
        }}
        back={{ onClick: onCancel }}
      />
    </>
  );
};

const errorProps = {
  condition: PropTypes.string,
  callbacks: PropTypes.object,
};

export const ErrorView = createErrorView({});

export const BrowserNotSupportedErrorView = createErrorView({
  children: () => <Browsers />,
});

ErrorView.props = errorProps;
BrowserNotSupportedErrorView.props = errorProps;
