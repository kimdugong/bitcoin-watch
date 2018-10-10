export const roundToDecimals = (n, input) =>
  +((1.0 / 10 ** n) * Math.round(10 ** n * input)).toFixed(n);
