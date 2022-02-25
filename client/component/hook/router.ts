//

import {
  useMatch,
  useNavigate,
  useLocation as useReactLocation
} from "@tanstack/react-location";
import {
  useCallback
} from "react";
import {
  usePopup
} from "/client/component/hook/popup";


export function usePath(): PathCallbacks {
  let navigate = useNavigate();
  let [, {clearAllPopups}] = usePopup();
  let pushPath = useCallback(function (path: string, options?: PathCallbackOptions): void {
    if (!options?.preservePopup) {
      clearAllPopups();
    }
    let search = options?.search ?? (options?.preserveSearch ? undefined : {});
    let hash = options?.hash ?? "";
    navigate({to: path, search, hash, replace: false});
  }, [navigate, clearAllPopups]);
  let replacePath = useCallback(function (path: string, options?: PathCallbackOptions): void {
    if (!options?.preservePopup) {
      clearAllPopups();
    }
    let search = options?.search ?? (options?.preserveSearch ? undefined : {});
    let hash = options?.hash ?? "";
    navigate({to: path, search, hash, replace: true});
  }, [navigate, clearAllPopups]);
  return {pushPath, replacePath};
}

export function useParams<P extends Params = Params>(): P {
  let match = useMatch();
  let params = match.params as P;
  return params;
}

export function useLoaderData<D extends LoaderData = LoaderData>(): D {
  let match = useMatch();
  let loaderData = match.data as D;
  return loaderData;
}

export function useLocation<S extends Search = Search>(): Location<S> {
  let reactLocation = useReactLocation();
  let rawLocation = reactLocation.current;
  let location = {
    path: rawLocation.pathname,
    search: rawLocation.search as S,
    searchString: rawLocation.searchStr,
    hash: rawLocation.hash,
    key: rawLocation.key
  };
  return location;
}

type PathCallback = (path: string, options?: PathCallbackOptions) => void;
type PathCallbackOptions = {
  search?: Record<string, unknown>,
  hash?: string,
  preservePopup?: boolean,
  preserveSearch?: boolean
};
type PathCallbacks = {
  pushPath: PathCallback,
  replacePath: PathCallback
};

type Params = Record<string, string>;
type Search = Record<string, unknown>;
type LoaderData = Record<string, any>;
type Location<S extends Search> = {
  path: string,
  search: S,
  searchString: string,
  hash: string,
  key: string | undefined
};