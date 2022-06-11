//

import type {
  DebouncedFunc
} from "lodash-es";
import debounce from "lodash-es/debounce";
import {
  DependencyList,
  useMemo
} from "react";
import {
  useUnmount
} from "react-use";


export function useDebounce<C extends (...args: Array<never>) => unknown>(callback: C, wait: number, dependencies: DependencyList): DebouncedFunc<C> {
  const debouncedCallback = useMemo(() => debounce(callback, wait), [wait, ...dependencies]);
  useUnmount(() => {
    debouncedCallback.cancel();
  });
  return debouncedCallback;
}