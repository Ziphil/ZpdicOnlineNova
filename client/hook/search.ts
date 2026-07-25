//

import {SetStateAction, useCallback, useMemo} from "react";
import {SetURLSearchParams, useSearchParams as useRawSearch} from "react-router";
import {resolveStateAction} from "/client/util/misc";


export function useSearch(): [Search, SetSearch] {
  const [search, setSearch] = useRawSearch();
  return [search, setSearch];
}

export function useSearchQuery<Q>({serializeQuery, deserializeQuery}: SearchQueryConverter<Q>): [Q, SetSearchQuery<Q>] {
  const [search, setSearch] = useSearch();
  const query = useMemo(() => deserializeQuery(search), [search, deserializeQuery]);
  const setQuery = useCallback(function (query: SetStateAction<Q>, options?: SetSearchQueryOptions): void {
    setSearch((prevSearch) => serializeQuery(resolveStateAction(query, deserializeQuery(prevSearch))), options);
  }, [setSearch, serializeQuery, deserializeQuery]);
  return [query, setQuery];
}

export type Search = URLSearchParams;
export type SetSearch = SetURLSearchParams;

export type SearchQueryConverter<Q> = {
  serializeQuery: (query: Q) => Search,
  deserializeQuery: (search: Search) => Q
};
export type SetSearchQuery<Q> = (query: SetStateAction<Q>, options?: SetSearchQueryOptions) => void;
export type SetSearchQueryOptions = {replace?: boolean};
