//

import {Dispatch, SetStateAction, useCallback, useEffect, useRef, useState} from "react";
import {useSearchParams as useRawSearch} from "react-router-dom";
import {useDebouncedCallback} from "zographia";
import {resolveStateAction} from "/client-new/util/misc";


export function useSearch(): [Search, Dispatch<SetStateAction<Search>>] {
  const [search, setSearch] = useRawSearch();
  return [search, setSearch];
}

export function useSearchState<S>({serialize, deserialize}: SearchConverter<S>, duration: number): [S, S, Dispatch<SetStateAction<S>>] {
  const [search, setSearch] = useSearch();
  const [state, setState] = useState(deserialize(search));
  const [debouncedState, setDebouncedStateShortly] = useState(deserialize(search));
  const setDebouncedState = useDebouncedCallback(setDebouncedStateShortly, duration, [setDebouncedStateShortly]);
  const updatedRef = useRef(false);
  const setSearchState = useCallback(function (state: SetStateAction<S>): void {
    setState(state);
    setDebouncedState((prevState) => {
      const nextState = resolveStateAction(state, prevState);
      const nextSearch = serialize(nextState);
      updatedRef.current = true;
      setSearch(nextSearch);
      return nextState;
    });
  }, [serialize, setDebouncedState, setSearch]);
  useEffect(() => {
    if (!updatedRef.current) {
      const state = deserialize(search);
      setState(state);
      setDebouncedStateShortly(state);
    }
    updatedRef.current = false;
  }, [search, setState, deserialize]);
  return [state, debouncedState, setSearchState];
}

export type Search = URLSearchParams;

export type SearchConverter<S> = {
  serialize: (state: S) => URLSearchParams,
  deserialize: (search: URLSearchParams) => S
};