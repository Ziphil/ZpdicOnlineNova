//

import {
  useCallback
} from "react";
import {
  useHistory
} from "react-router-dom";
import {
  usePopup
} from "/client/component/hook/popup";


export function usePath(): PathCallbacks {
  let history = useHistory();
  let [, {clearAllPopups}] = usePopup();
  let pushPath = useCallback(function (path: string, state?: object, preservesPopup?: boolean): void {
    if (!preservesPopup) {
      clearAllPopups();
    }
    history.push(path, state);
  }, [history, clearAllPopups]);
  let replacePath = useCallback(function (path: string, state?: object, preservesPopup?: boolean): void {
    if (!preservesPopup) {
      clearAllPopups();
    }
    history.replace(path, state);
  }, [history, clearAllPopups]);
  return {pushPath, replacePath};
}

type PathCallback = (path: string, state?: object, preservesPopup?: boolean) => void;
type PathCallbacks = {
  pushPath: PathCallback,
  replacePath: PathCallback
};