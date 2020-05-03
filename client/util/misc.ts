//


export function swap<T>(array: Array<T>, index: number, direction: 1 | -1): Array<T> {
  let targetIndex = index + direction;
  if (index >= 0 && index < array.length && targetIndex >= 0 && targetIndex < array.length) {
    let temp = array[index];
    array[index] = array[targetIndex];
    array[targetIndex] = temp;
  }
  return array;
}

export function deleteAt<T>(array: Array<T>, index: number): Array<T> {
  if (index >= 0 && index < array.length) {
    array.splice(index, 1);
  }
  return array;
}

export function hasTypedOwnProperty<T extends object>(object: T, key: string | symbol | number): key is keyof T {
  return object.hasOwnProperty(key);
}