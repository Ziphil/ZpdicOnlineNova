//

import {Dispatch, SetStateAction, useCallback, useState} from "react";
import {useSearchParams as useRawSearch} from "react-router-dom";
import {useDebounce} from "/client-new/hook/debounce";
import {resolveStateAction} from "/client-new/util/misc";


export function useSearch(): [Search, Dispatch<SetStateAction<Search>>] {
  const [search, setSearch] = useRawSearch();
  return [search, setSearch];
}

export function useSearchState<S>({serialize, deserialize}: SearchConverter<S>, duration: number): [S, S, Dispatch<SetStateAction<S>>] {
  const [search, setSearch] = useSearch();
  const [prevSearch, setPrevSearch] = useState(search);
  const [state, setState] = useState(deserialize(search));
  const [debouncedState, setDebouncedStateShortly] = useState(deserialize(search));
  const setDebouncedState = useDebounce(setDebouncedStateShortly, duration, [setDebouncedStateShortly]);
  const setSearchState = useCallback(function (state: SetStateAction<S>): void {
    setState(state);
    setDebouncedState((prevState) => {
      const nextState = resolveStateAction(state, prevState);
      const nextSearch = serialize(nextState);
      setPrevSearch(nextSearch);
      setSearch(nextSearch);
      return nextState;
    });
  }, [serialize, setDebouncedState, setSearch]);
  if (prevSearch !== search) {
    const state = deserialize(search);
    setPrevSearch(search);
    setState(state);
    setDebouncedStateShortly(state);
  }
  return [state, debouncedState, setSearchState];
}

export type Search = URLSearchParams;

export type SearchConverter<S> = {
  serialize: (state: S) => URLSearchParams,
  deserialize: (search: URLSearchParams) => S
};