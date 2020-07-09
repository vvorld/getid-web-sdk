import React from 'react';
import PropTypes from 'prop-types';
import {
  AppExistsView, CameraErrorView, ErrorView, ApiVersionErrorView,
} from './views/error';

class ErrorBoundary extends React.Component {
  componentDidCatch(error, errorInfo) {
    const { api } = this.props.children.props;
    if (api) {
      api.sendErrorToServer(error.toString(), errorInfo.componentStack);
    }
  }

  render() {
    const {
      cameraNoSupported,
      errorMessage,
      onFail,
      onExists,
      exists,
      isSupportedApiVersion,
      responseCode,
    } = this.props.children.props;

    if (cameraNoSupported) { return <CameraErrorView />; }
    if (errorMessage
        || responseCode) { return <ErrorView error={errorMessage} callbacks={{ onFail }} />; }
    if (exists) { return <AppExistsView callbacks={{ onExists }} />; }
    if (isSupportedApiVersion === false) { return <ApiVersionErrorView />; }
    return this.props.children;
  }
}

ErrorBoundary.defaultProps = {
  children: {
    props: {
      api: null,
      cameraNoSupported: false,
      exists: false,
      errorMessage: '',
      onFail: null,
      onExists: null,
    },
  },
};

ErrorBoundary.propTypes = {
  children: PropTypes.shape({
    props: PropTypes.shape({
      cameraNoSupported: PropTypes.bool,
      exists: PropTypes.bool,
      api: PropTypes.object,
      errorMessage: PropTypes.string,
      isSupportedApiVersion: PropTypes.bool,
      onFail: PropTypes.func,
      onExists: PropTypes.func,
      responseCode: PropTypes.number,
    }),
  }),
};

export default ErrorBoundary;
