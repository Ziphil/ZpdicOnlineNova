//

import type {
  DebouncedFunc
} from "lodash-es";
import debounce from "lodash-es/debounce";
import {
  DependencyList,
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useState
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

export function useDebouncedState<S>(initialState: S | (() => S), wait: number): [S, S, Dispatch<SetStateAction<S>>] {
  const [state, setState] = useState(initialState);
  const [debouncedState, setDebouncedStateImmediately] = useState(initialState);
  const setDebouncedState = useDebounce(setDebouncedStateImmediately, wait, [setDebouncedStateImmediately]);
  const setBothState = useCallback(function (state: SetStateAction<S>): void {
    setState(state);
    setDebouncedState(state);
  }, [setDebouncedState]);
  return [state, debouncedState, setBothState];
}