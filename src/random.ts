export const withSeededRandom = <T>(
  random: () => number,
  factory: () => T,
): T => {
  const originalRandom = Math.random;

  Math.random = random;
  const value = factory();

  Math.random = originalRandom;

  return value;
};
