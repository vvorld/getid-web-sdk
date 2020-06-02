import { makeStyles } from '@material-ui/core';

const customCheckbox = makeStyles((theme) => ({
  icon: {
    outline: 'none',
    width: 20,
    height: 20,
    boxSizing: 'border-box',
    border: `1px solid ${theme.palette.gray.main}`,
    borderRadius: '4px',
  },
  checkedIcon: {
    outline: 'none',
    backgroundColor: theme.palette.violet.main,
    backgroundImage:
        "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath"
        + " fill-rule='evenodd' clip-rule='evenodd' d='M12 5c-.28 0-.53.11-.71.29L7 9.59l-2.29-2.3a1.003 "
        + "1.003 0 00-1.42 1.42l3 3c.18.18.43.29.71.29s.53-.11.71-.29l5-5A1.003 1.003 0 0012 5z' fill='%23fff'/%3E%3C/svg%3E\")",
  },
}));

export default customCheckbox;
