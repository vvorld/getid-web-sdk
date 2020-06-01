import { makeStyles } from '@material-ui/core';

const customInputStyles = makeStyles((theme) => ({
  root: {
    ...theme.typography.mainInput,
  },
  labelRoot: {
    ...theme.typography.label,
  },
}));

export default customInputStyles;
