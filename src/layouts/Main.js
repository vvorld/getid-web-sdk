import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Widget from './Widget';
import actions from '../store/actions';
import {
  getCurrentComponent, getFormValues, getIsDisabled, getScanValues, getStep, getIdCaptureBackIndex,
} from '../store/selectors';

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.api = props.api;
    this.state = {
      initialStep: null,
      initialBSIndex: -1,
    };
  }

  componentDidMount() {
    this.setSdkFlow();
    this.getBackStepIndexAndStep();
  }

  componentDidCatch(error, errorInfo) {
    this.api.sendErrorToServer(error.toString(), errorInfo.componentStack);
  }

    getBackStepIndexAndStep = () => {
      const { flow, setIdCaptureBack } = this.props;
      this.setState(() => ({
        initialStep: flow
          .find((item) => item.component.includes('IdCaptureBack')) || {},
      }));

      this.setState((state) => ({
        initialBSIndex: flow.indexOf(state.initialStep) || -1,
      }));
      const stepWithIdCaptureBack = flow
        .find((item) => item.component.includes('IdCaptureBack')) || {};
      setIdCaptureBack(flow.indexOf(stepWithIdCaptureBack) || -1);
    };

    setSdkFlow = () => {
      const {
        flow, setFlow,
      } = this.props;

      setFlow(flow);
    };

    render() {
      const { flow } = this.props;
      if (!flow) return null;
      const properties = { ...this.props, ...this.state };
      return (
        <Widget {...properties} />
      );
    }
}

Main.defaultProps = {
  flow: [],
};

Main.propTypes = {
  flow: PropTypes.array,
  setFlow: PropTypes.func.isRequired,
  setIdCaptureBack: PropTypes.func.isRequired,
  api: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  fieldValues: getFormValues(state),
  isDisabled: getIsDisabled(state),
  currentStep: getStep(state),
  scans: getScanValues(state),
  currentComponent: getCurrentComponent(state),
  idCaptureBackIndex: getIdCaptureBackIndex(state),
});

export default connect(
  mapStateToProps,
  actions,
)(Main);
