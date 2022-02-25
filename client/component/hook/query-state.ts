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
  let search = useSearch();
  let navigate = useNavigate();
  let [getState, setState] = useGetSet<S>(() => {
    let state = deserializeQuery(search);
    return state;
  });
  let updatedRef = useRef(false);
  let setStateQuery = useCallback(function (state: SetStateAction<S>): void {
    setState((previousState) => {
      let nextState = (state instanceof Function) ? state(previousState) : state;
      let search = serializeQuery(nextState);
      updatedRef.current = true;
      navigate({search, replace: true});
      return nextState;
    });
  }, [navigate, setState, serializeQuery]);
  useEffect(() => {
    if (!updatedRef.current) {
      let state = deserializeQuery(search);
      setState(state);
    }
    updatedRef.current = false;
  }, [search, setState, deserializeQuery]);
  return [getState, setStateQuery];
}

export type Search = Record<string, unknown>;