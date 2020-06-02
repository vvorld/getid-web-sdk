const stepperStyles = (theme) => ({
  alternativeLabel: {
    top: 7,
    left: 'calc(-50% + 8px)',
    right: 'calc(50% + 8px)',
    position: 'absolute',
    backgroundColor: theme.palette.gray.light,
  },
  active: {
    '& $line': {
      border: `3px solid ${theme.palette.violet.main}`,
    },
  },
  completed: {
    '& $line': {
      border: `3px solid  ${theme.palette.violet.main}`,
    },
  },
  line: {
    border: `3px solid ${theme.palette.gray.light}`,
    justifyContent: 'center',
    alignItems: 'center',
  },
});


export default stepperStyles;
