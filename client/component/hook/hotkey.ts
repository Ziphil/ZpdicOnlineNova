//

import Mousetrap from "mousetrap";
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
    Mousetrap.bind(key, callback);
    let cleanup = function (): void {
      Mousetrap.unbind(key);
    };
    return cleanup;
  }, [key, callback]);
}

Mousetrap.prototype.stopCallback = function (event: ExtendedKeyboardEvent, element: any, combo: string): boolean {
  let tagName = element.tagName.toLowerCase();
  if (tagName === "input" || tagName === "select" || tagName === "textarea" || (element.contentEditable && element.contentEditable === "true")) {
    if (combo === "esc") {
      return false;
    } else {
      return true;
    }
  } else {
    return false;
  }
};