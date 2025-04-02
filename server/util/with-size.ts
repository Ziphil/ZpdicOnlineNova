//

import type {WithSize} from "/server/util/query";


export function mapWithSize<T, U>(result: WithSize<T>, callback: (value: T, index: number) => U): WithSize<U> {
  const [value, size] = result;
  return [value.map(callback), size];
}

export async function mapWithSizeAsync<T, U>(result: WithSize<T>, callback: (value: T, index: number) => PromiseLike<U>): Promise<WithSize<U>> {
  const [value, size] = result;
  const mappedValue = await Promise.all(value.map(callback));
  return [mappedValue, size];
}
