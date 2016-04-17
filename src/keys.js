export const KEYS = {
  UP_ARROW: 38,
  RIGHT_ARROW: 39,
  LEFT_ARROW: 37,
  DOWN_ARROW: 40,
  R: 82,
  A: 65,
};

export const ARROW_KEYS = new Set(
  Object.keys(KEYS)
    .filter((k) => k.includes('ARROW'))
    .map((k) => KEYS[k])
);

