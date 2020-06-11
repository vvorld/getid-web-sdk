const stepperStyles = (theme) => ({
  alternativeLabel: {
    top: 7,
    left: 'calc(-50% + 8px)',
    right: 'calc(50% + 8px)',
    position: 'absolute',
  },
  active: {
    '& $line': {
      backgroundColor: theme.palette.violet.main,
    },
  },
  completed: {
    '& $line': {
      backgroundColor: theme.palette.violet.main,
    },
  },
  line: {
    height: 6,
    border: 0,
    backgroundColor: theme.palette.gray.light,
  },
});


export default stepperStyles;
