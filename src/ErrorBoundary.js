import React from 'react';
import PropTypes from 'prop-types';

class ErrorBoundary extends React.Component {
  componentDidCatch(error, errorInfo) {
    const { api } = this.props.children.props;
    if (api) {
      api.sendErrorToServer(error.toString(), errorInfo.componentStack);
    }
  }

  render() {
    return this.props.children;
  }
}

ErrorBoundary.defaultProps = {
  children: {
    props: {
      api: null,
    },
  },
};

ErrorBoundary.propTypes = {
  children: PropTypes.shape({
    props: PropTypes.shape({
      api: PropTypes.object,
    }),
  }),
};

export default ErrorBoundary;
