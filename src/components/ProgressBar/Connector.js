import { withStyles } from '@material-ui/core/styles';
import StepConnector from '@material-ui/core/StepConnector';
import stepperTheme from '../../assets/Stepper';

const { main, light } = stepperTheme.palette.primary;

const CustomisedConnector = withStyles({
  alternativeLabel: {
    top: 7,
    left: 'calc(-50% + 8px)',
    right: 'calc(50% + 8px)',
    position: 'absolute',
    backgroundColor: light,
  },
  active: {
    '& $line': {
      border: `3px solid ${main}`,
    },
  },
  completed: {
    '& $line': {
      border: `3px solid ${main}`,
    },
  },
  line: {
    border: `3px solid ${light}`,
    justifyContent: 'center',
    alignItems: 'center',
  },
})(StepConnector);

export default CustomisedConnector;
