export type MethodsOnlyType = {
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  [key: string | number | symbol]: (this: MethodsOnlyType, ...args: any[]) => any
}
