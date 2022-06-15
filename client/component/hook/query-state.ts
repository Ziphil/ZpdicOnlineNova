//

import {
  useNavigate,
  useSearch
} from "@tanstack/react-location";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef
} from "react";
import {
  useGetSet
} from "react-use";


export function useQueryState<S>(serializeQuery: (state: S) => Search, deserializeQuery: (search: Search) => S): [() => S, Dispatch<SetStateAction<S>>] {
  const search = useSearch();
  const navigate = useNavigate();
  const [getState, setState] = useGetSet<S>(() => {
    const state = deserializeQuery(search);
    return state;
  });
  const updatedRef = useRef(false);
  const setStateQuery = useCallback(function (state: SetStateAction<S>): void {
    setState((previousState) => {
      const nextState = (state instanceof Function) ? state(previousState) : state;
      const search = serializeQuery(nextState);
      updatedRef.current = true;
      navigate({search, replace: true});
      return nextState;
    });
  }, [navigate, setState, serializeQuery]);
  useEffect(() => {
    if (!updatedRef.current) {
      const state = deserializeQuery(search);
      setState(state);
    }
    updatedRef.current = false;
  }, [search, setState, deserializeQuery]);
  return [getState, setStateQuery];
}

export type Search = Record<string, unknown>;