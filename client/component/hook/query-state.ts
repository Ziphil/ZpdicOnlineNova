//

import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef
} from "react";
import {
  useHistory,
  useLocation
} from "react-router-dom";
import {
  useGetSet
} from "react-use";


export function useQueryState<S>(serializeQuery: (state: S) => string, deserializeQuery: (queryString: string) => S): [() => S, Dispatch<SetStateAction<S>>] {
  let history = useHistory();
  let location = useLocation();
  let [getState, setState] = useGetSet<S>(() => {
    let queryString = location.search;
    let state = deserializeQuery(queryString);
    return state;
  });
  let lastQueryStringRef = useRef<string>();
  let setStateQuery = useCallback(function (state: SetStateAction<S>): void {
    setState((previousState) => {
      let nextState = (state instanceof Function) ? state(previousState) : state;
      let queryString = serializeQuery(nextState);
      lastQueryStringRef.current = queryString;
      history.replace({search: queryString});
      return nextState;
    });
  }, [history, setState, serializeQuery]);
  useEffect(() => {
    let queryString = location.search;
    if (lastQueryStringRef.current !== queryString) {
      let state = deserializeQuery(queryString);
      lastQueryStringRef.current = queryString;
      setState(state);
    }
  }, [location.search, setState, deserializeQuery]);
  return [getState, setStateQuery];
}