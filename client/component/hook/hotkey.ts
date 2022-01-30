//

import Mousetrap from "mousetrap";
import {
  ExtendedKeyboardEvent
} from "mousetrap";
import {
  useEffect
} from "react";
import {
  createGlobalState
} from "react-use";


let useRawHotkeySpecs = createGlobalState<Array<HotkeySpec>>([]);

export function useHotkey(name: string, group: HotkeyGroup, key: string | Array<string>, callback: HotkeyCallback): void {
  let [, setHotkeySpecs] = useRawHotkeySpecs();
  useEffect(() => {
    Mousetrap.bind(key, callback);
    setHotkeySpecs((hotkeySpecs) => [...hotkeySpecs, {name, group, key}]);
    let cleanup = function (): void {
      Mousetrap.unbind(key);
      setHotkeySpecs((hotkeySpecs) => hotkeySpecs.filter((hotkeySpec) => hotkeySpec.key === key));
    };
    return cleanup;
  }, [name, group, key, callback, setHotkeySpecs]);
}

export function useHotkeySpecs(): Array<HotkeySpec> {
  let [hotkeySpecs] = useRawHotkeySpecs();
  return hotkeySpecs;
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

export type HotkeySpec = {name: string, group: HotkeyGroup, key: string | Array<string>};
export type HotkeyCallback = (event: ExtendedKeyboardEvent, combo: string) => void;
export type HotkeyGroup = string;