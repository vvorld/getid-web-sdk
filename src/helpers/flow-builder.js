export const buildFlow = (flow) => {
  if (!flow) return {};

  return flow.map((item, index) => {
    const { component } = item;

    return {
      component,
      order: index,
      next: flow[index + 1] || null,
    };
  });
};
