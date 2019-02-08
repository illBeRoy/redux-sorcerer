export const attempt = (action: () => void) => {
  try {
    action();
  } catch (err) {
    // ignore
  }
};
