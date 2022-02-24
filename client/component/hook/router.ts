//

import {
  useMatch,
  useNavigate,
  useLocation as useReactLocation,
  useRouter
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
  let pushPath = useCallback(function (path: string, state?: object, preservesPopup?: boolean): void {
    if (!preservesPopup) {
      clearAllPopups();
    }
    navigate({to: path, search: {}, hash: "", replace: false});
  }, [navigate, clearAllPopups]);
  let replacePath = useCallback(function (path: string, state?: object, preservesPopup?: boolean): void {
    if (!preservesPopup) {
      clearAllPopups();
    }
    navigate({to: path, search: {}, hash: "", replace: true});
  }, [navigate, clearAllPopups]);
  return {pushPath, replacePath};
}

export function useParams(): Record<string, string> {
  let match = useMatch();
  return match.params;
}

export function useLocation(): Location {
  let reactLocation = useReactLocation();
  let rawLocation = reactLocation.current;
  let location = {path: rawLocation.pathname, search: rawLocation.search, searchString: rawLocation.searchStr, hash: rawLocation.hash};
  return location;
}

type PathCallback = (path: string, state?: object, preservesPopup?: boolean) => void;
type PathCallbacks = {
  pushPath: PathCallback,
  replacePath: PathCallback
};
type Location = {
  path: string,
  search: Record<string, unknown>,
  searchString: string,
  hash: string
};