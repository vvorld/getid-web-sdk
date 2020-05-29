import { makeStyles } from '@material-ui/core';

const customisedStepIconStyles = makeStyles((theme) => ({
  root: {
    width: theme.stepperShape.width,
    height: theme.stepperShape.height,
    backgroundColor: theme.palette.stepperLight,
    zIndex: 1,
    display: 'flex',
    borderRadius: theme.stepperShape.borderRadius,
    justifyContent: 'center',
    alignItems: 'center',
  },
  active: {
    width: theme.stepperShape.width,
    height: theme.stepperShape.height,
    background: theme.palette.violet.main,
  },
  completed: {
    width: theme.stepperShape.width,
    height: theme.stepperShape.height,
    background: theme.palette.violet.main,
  },
  none: {
    background: 'transparent',
  },
}));

export default customisedStepIconStyles;
