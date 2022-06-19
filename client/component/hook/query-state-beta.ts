//

import {
  useNavigate,
  useSearch
} from "@tanstack/react-location";
import {
  useCallback,
  useEffect,
  useRef,
  useState
} from "react";
import {
  useDebounce
} from "/client/component/hook";


export function useQueryState<S>(serializeQuery: (state: S) => Search, deserializeQuery: (search: Search) => S, wait: number): [S, S, (state: S) => void] {
  const search = useSearch();
  const navigate = useNavigate();
  const [state, setState] = useState(deserializeQuery(search));
  const [debouncedState, setDebouncedStateImmediately] = useState(deserializeQuery(search));
  const setDebouncedState = useDebounce(setDebouncedStateImmediately, wait, [setDebouncedStateImmediately]);
  const updatedRef = useRef(false);
  const setQueryState = useCallback(function (state: S): void {
    setState(state);
    setDebouncedState(() => {
      const search = serializeQuery(state);
      updatedRef.current = true;
      navigate({search, replace: true});
      return state;
    });
  }, [navigate, setState, setDebouncedState, serializeQuery]);
  useEffect(() => {
    if (!updatedRef.current) {
      const state = deserializeQuery(search);
      setState(state);
      setDebouncedStateImmediately(state);
    }
    updatedRef.current = false;
  }, [search, setState, deserializeQuery]);
  return [state, debouncedState, setQueryState];
}

export type Search = Record<string, unknown>;