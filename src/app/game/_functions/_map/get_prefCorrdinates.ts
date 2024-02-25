export type coordinate = {
  x: number;
  y: number;
};

export const get_prefCoordinates = (map: number[][]): coordinate[][] => {
  let prefCoordinates: coordinate[][] = [];
  for (let i = 0; i < 1000; ++i) {
    prefCoordinates.push([]);
  }
  map.forEach((row, x) => {
    row.forEach((item, y) => {
      if (item > 0) {
        prefCoordinates[item].push({ x: x, y: y });
      }
    });
  });
  return prefCoordinates;
};
