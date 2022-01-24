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
  let [state, setState] = useState(initialState ?? null);
  return [state, setState];
}

export function useStateWithCallback<S>(initialState: S | (() => S)): [S, DispatchWithCallback<SetStateAction<S>, S>] {
  let [state, setState] = useState(initialState);
  let callbackRef = useRef<(state: S) => void>();
  let setStateWithCallback = useCallback(function (state: SetStateAction<S>, callback?: (state: S) => void) {
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