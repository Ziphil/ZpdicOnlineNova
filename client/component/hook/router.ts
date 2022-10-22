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
  const navigate = useNavigate();
  const {clearAllPopups} = usePopup();
  const pushPath = useCallback(function (path: string, options?: PathCallbackOptions): void {
    if (!options?.preservePopup) {
      clearAllPopups();
    }
    if (path.startsWith("#")) {
      const search = options?.search ?? (options?.preserveSearch ? undefined : {});
      const hash = path.slice(1);
      navigate({search, hash, replace: false});
    } else {
      const search = options?.search ?? (options?.preserveSearch ? undefined : {});
      const hash = options?.hash ?? "";
      navigate({to: path, search, hash, replace: false});
    }
  }, [navigate, clearAllPopups]);
  const replacePath = useCallback(function (path: string, options?: PathCallbackOptions): void {
    if (!options?.preservePopup) {
      clearAllPopups();
    }
    if (path.startsWith("#")) {
      const search = options?.search ?? (options?.preserveSearch ? undefined : {});
      const hash = path.slice(1);
      navigate({search, hash, replace: true});
    } else {
      const search = options?.search ?? (options?.preserveSearch ? undefined : {});
      const hash = options?.hash ?? "";
      navigate({to: path, search, hash, replace: true});
    }
  }, [navigate, clearAllPopups]);
  return {pushPath, replacePath};
}

export function useParams<P extends Params = Params>(): P {
  const match = useMatch();
  const params = match.params as P;
  return params;
}

export function useLoaderData<D extends LoaderData = LoaderData>(): D {
  const match = useMatch();
  const loaderData = match.data as D;
  return loaderData;
}

export function useLocation<S extends Search = Search>(): Location<S> {
  const reactLocation = useReactLocation();
  const rawLocation = reactLocation.current;
  const location = {
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