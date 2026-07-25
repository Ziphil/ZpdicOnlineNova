//

import {SetURLSearchParams, useSearchParams as useRawSearch} from "react-router";


export function useSearch(): [Search, SetSearch] {
  const [search, setSearch] = useRawSearch();
  return [search, setSearch];
}

export type Search = URLSearchParams;
export type SetSearch = SetURLSearchParams;
