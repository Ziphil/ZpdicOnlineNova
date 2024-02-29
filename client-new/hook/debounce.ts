//

import type {DebouncedFunc} from "lodash-es";
import debounce from "lodash-es/debounce";
import {
  DependencyList,
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState
} from "react";


export function useDebounceCallback<C extends (...args: Array<never>) => unknown>(callback: C, duration: number, dependencies: DependencyList): DebouncedFunc<C> {
  const debouncedCallback = useMemo(() => debounce(callback, duration), [duration, ...dependencies]);
  useEffect(() => {
    debouncedCallback.cancel();
  }, [debouncedCallback]);
  return debouncedCallback;
}

export function useDebouncedState<S>(initialState: S | (() => S), duration: number): [S, S, Dispatch<SetStateAction<S>>] {
  const [state, setState] = useState(initialState);
  const [debouncedState, setDebouncedStateImmediately] = useState(initialState);
  const setDebouncedState = useDebounceCallback(setDebouncedStateImmediately, duration, [setDebouncedStateImmediately]);
  const setBothState = useCallback(function (state: SetStateAction<S>): void {
    setState(state);
    setDebouncedState(state);
  }, [setDebouncedState]);
  return [state, debouncedState, setBothState];
}