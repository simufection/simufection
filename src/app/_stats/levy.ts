export const levyDist = (mu: number, c: number) => (x: number) => {
  if (x <= mu) return 0;
  return (
    (Math.sqrt(c / (2 * Math.PI)) * Math.exp(-c / (2 * (x - mu)))) /
    Math.pow(x - mu, 3 / 2)
  );
};

export const randLevy = (mu: number, c: number, max: number = 10) => {
  let x = 0;
  let density = 0;
  while (true) {
    x = mu + Math.random() * max;
    density = levyDist(mu, c)(x);
    if (Math.random() < density) {
      return x;
    }
  }
};
