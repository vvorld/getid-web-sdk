const stepperStyles = (theme) => ({
  alternativeLabel: {
    top: 7,
    left: 'calc(-50% + 8px)',
    right: 'calc(50% + 8px)',
    position: 'absolute',
    backgroundColor: theme.palette.stepperLight,
  },
  active: {
    '& $line': {
      border: `3px solid ${theme.palette.violet}`,
    },
  },
  completed: {
    '& $line': {
      border: `3px solid  ${theme.palette.violet}`,
    },
  },
  line: {
    border: `3px solid ${theme.palette.stepperLight}`,
    justifyContent: 'center',
    alignItems: 'center',
  },
});


export default stepperStyles;
