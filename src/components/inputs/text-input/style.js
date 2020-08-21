import { makeStyles } from '@material-ui/core';

const customInputStyles = makeStyles((theme) => ({
  root: {
    ...theme.typography.mainInput,
    color: 'rgba(0, 0, 0, 0.38)',
  },
  labelRoot: {
    ...theme.typography.label,
  },
}));

export default customInputStyles;
