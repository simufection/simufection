type FixedLengthArray<T, N extends number, A extends any[] = []> = A extends {
  length: N;
}
  ? A
  : FixedLengthArray<T, N, [...A, T]>;

type Partial<T> = {
  [P in keyof T]?: T[P];
};

type Position = { x: number; y: number };
