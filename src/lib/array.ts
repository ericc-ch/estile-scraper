export function chunk<T>(input: Array<T>, size: number): Array<Array<T>> {
  if (size <= 0) {
    throw new Error("Size must be greater than 0")
  }

  return input.reduce<Array<Array<T>>>((arr, item, idx) => {
    return idx % size === 0 ?
        [...arr, [item]]
      : [...arr.slice(0, -1), [...arr[arr.length - 1], item]]
  }, [])
}
