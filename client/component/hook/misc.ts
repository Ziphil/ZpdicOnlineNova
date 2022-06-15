//

import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState
} from "react";


export function useNullableState<S>(initialState?: (S | null) | (() => S | null)): [S | null, Dispatch<SetStateAction<S | null>>] {
  const [state, setState] = useState(initialState ?? null);
  return [state, setState];
}

export function useStateWithCallback<S>(initialState: S | (() => S)): [S, DispatchWithCallback<SetStateAction<S>, S>] {
  const [state, setState] = useState(initialState);
  const callbackRef = useRef<(state: S) => void>();
  const setStateWithCallback = useCallback(function (state: SetStateAction<S>, callback?: (state: S) => void) {
    callbackRef.current = callback;
    setState(state);
  }, []);
  useEffect(() => {
    if (callbackRef.current) {
      callbackRef.current(state);
      callbackRef.current = undefined;
    }
  }, [state]);
  return [state, setStateWithCallback];
}

export type DispatchWithCallback<A, S> = (value: A, callback?: (state: S) => void) => void;