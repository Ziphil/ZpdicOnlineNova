//

import mousetrap from "mousetrap";
import {
  ExtendedKeyboardEvent
} from "mousetrap";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState
} from "react";


export function useHotkey(name: string, group: string, key: string | Array<string>, callback: (event: ExtendedKeyboardEvent, combo: string) => void) {
  useEffect(() => {
    mousetrap.bind(key, callback);
    let cleanup = function (): void {
      mousetrap.unbind(key);
    };
    return cleanup;
  }, [key, callback]);
}