export const sumObjects = (a = {}, b = {}) => ({
  ...a,
  ...b,
  ...Object.keys(a).reduce(
    (acc, key) => ((acc[key] = (a[key] || 0) + (b[key] || 0)), acc),
    {}
  ),
})

export const sumYears = (years: number[][]) =>
  years.reduce((r, a) => a.map((b, i) => (r[i] || 0) + b), [])
