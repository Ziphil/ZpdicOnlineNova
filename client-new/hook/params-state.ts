//

import {useCallback, useEffect, useRef, useState} from "react";
import {URLSearchParamsInit, useSearchParams} from "react-router-dom";
import {useDebounce} from "/client-new/hook/debounce";


export function useParamsState<S>({serialize, deserialize}: ParamsConverter<S>, duration: number): [S, S, (state: S) => void] {
  const [params, setParams] = useSearchParams();
  const [state, setState] = useState(deserialize(params));
  const [debouncedState, setDebouncedStateShortly] = useState(deserialize(params));
  const setDebouncedState = useDebounce(setDebouncedStateShortly, duration, [setDebouncedStateShortly]);
  const updatedRef = useRef(false);
  const setParamsState = useCallback(function (state: S): void {
    setState(state);
    setDebouncedState(() => {
      const params = serialize(state);
      updatedRef.current = true;
      setParams(params);
      return state;
    });
  }, [serialize, setState, setDebouncedState, setParams]);
  useEffect(() => {
    if (!updatedRef.current) {
      const state = deserialize(params);
      setState(state);
      setDebouncedStateShortly(state);
    }
    updatedRef.current = false;
  }, [deserialize, params, setState]);
  return [state, debouncedState, setParamsState];
}

export type ParamsConverter<S> = {
  serialize: (state: S) => URLSearchParamsInit,
  deserialize: (params: URLSearchParams) => S
};