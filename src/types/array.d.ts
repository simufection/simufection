type FixedLengthArray<T, N extends number, A extends any[] = []> = A extends {
  length: N;
}
  ? A
  : FixedLengthArray<T, N, [...A, T]>;
