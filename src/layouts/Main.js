import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Widget from './widget';
import actions from '../store/actions';
import {
  getCurrentComponent, getFormValues, getIsDisabled, getScanValues, getStep, getIdCaptureBackIndex,
} from '../store/selectors';
import { getEventStepName } from '../helpers/generic';

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      initialStep: null,
      initialBSIndex: -1,
    };
  }

  componentDidMount() {
    const { flow, setFlow } = this.props;
    setFlow(flow);
    this.getBackStepIndexAndStep();
  }

  componentDidUpdate(prevProps) {
    const {
      currentStep, currentComponent,
    } = this.props;

    if ((prevProps.currentStep < currentStep) && currentComponent.next) {
      this.sendEvent(prevProps);
    }
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

  sendEvent = async (prevProps) => {
    const {
      api, idCaptureBackIndex,
    } = this.props;

    const stepName = getEventStepName(prevProps.currentComponent, idCaptureBackIndex);
    await api.trySendEvent(stepName, 'completed');
  }

  render() {
    return (
      <Widget {...this.props} {...this.state} />
    );
  }
}

Main.defaultProps = {
  flow: [],
  fields: [],
  currentComponent: null,
};

Main.propTypes = {
  flow: PropTypes.array,
  setFlow: PropTypes.func.isRequired,
  addField: PropTypes.func.isRequired,
  fields: PropTypes.array,
  setIdCaptureBack: PropTypes.func.isRequired,
  currentComponent: PropTypes.any,
  api: PropTypes.object.isRequired,
  currentStep: PropTypes.number.isRequired,
  idCaptureBackIndex: PropTypes.number.isRequired,
};

const mapStateToProps = (state) => ({
  fieldValues: getFormValues(state),
  isDisabled: getIsDisabled(state),
  currentStep: getStep(state),
  scans: getScanValues(state),
  currentComponent: getCurrentComponent(state),
  idCaptureBackIndex: getIdCaptureBackIndex(state),
  // countryDocuments: getCountryDocuments(state),
});

export default connect(
  mapStateToProps,
  actions,
)(Main);
