export const sleep = (duration: number): Promise<void> =>
  new Promise((resolve) => {
    window.setTimeout(resolve, duration);
  });