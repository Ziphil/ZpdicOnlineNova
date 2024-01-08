//

import {Dispatch, SetStateAction, useCallback, useState} from "react";
import {useSearchParams} from "react-router-dom";
import {useDebounce} from "/client-new/hook/debounce";
import {resolveStateAction} from "/client-new/util/misc";


export function useParamsState<S>({serialize, deserialize}: ParamsConverter<S>, duration: number): [S, S, Dispatch<SetStateAction<S>>] {
  const [params, setParams] = useSearchParams();
  const [prevParams, setPrevParams] = useState(params);
  const [state, setState] = useState(deserialize(params));
  const [debouncedState, setDebouncedStateShortly] = useState(deserialize(params));
  const setDebouncedState = useDebounce(setDebouncedStateShortly, duration, [setDebouncedStateShortly]);
  const setParamsState = useCallback(function (state: SetStateAction<S>): void {
    setState(state);
    setDebouncedState((prevState) => {
      const nextState = resolveStateAction(state, prevState);
      const nextParams = serialize(nextState);
      setPrevParams(nextParams);
      setParams(nextParams);
      return nextState;
    });
  }, [serialize, setDebouncedState, setParams]);
  if (prevParams !== params) {
    const state = deserialize(params);
    setPrevParams(params);
    setState(state);
    setDebouncedStateShortly(state);
  }
  return [state, debouncedState, setParamsState];
}

export type ParamsConverter<S> = {
  serialize: (state: S) => URLSearchParams,
  deserialize: (params: URLSearchParams) => S
};