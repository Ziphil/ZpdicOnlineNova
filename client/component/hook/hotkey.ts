//

import Mousetrap from "mousetrap";
import {
  ExtendedKeyboardEvent
} from "mousetrap";
import {
  DependencyList,
  useEffect
} from "react";
import {
  createGlobalState
} from "react-use";


const HOTKEY_SPECS = [
  {name: "showHotkeyHelp", group: "general", keys: ["?"]},
  {name: "unfocus", group: "general", keys: ["esc"]},
  {name: "jumpDashboardPage", group: "navigation", keys: ["g u"]},
  {name: "jumpDictionaryListPage", group: "navigation", keys: ["g l"]},
  {name: "jumpNotificationPage", group: "navigation", keys: ["g n"]},
  {name: "jumpDocumentPage", group: "navigation", keys: ["g h"]},
  {name: "jumpContactPage", group: "navigation", keys: ["g c"]},
  {name: "jumpDictionaryPage", group: "navigation", keys: ["g d"]},
  {name: "jumpDictionarySettingPage", group: "navigation", keys: ["g s"]},
  {name: "jumpExamplePage", group: "navigation", keys: ["g e"]},
  {name: "addWord", group: "editDictionary", keys: ["n w"]},
  {name: "addExample", group: "editDictionary", keys: ["n e"]},
  {name: "addCommission", group: "editDictionary", keys: ["n r"]},
  {name: "toggleWordEditor", group: "editDictionary", keys: ["w"]},
  {name: "focusSearch", group: "searchWords", keys: ["s"]},
  {name: "movePreviousPage", group: "searchWords", keys: ["j"]},
  {name: "moveNextPage", group: "searchWords", keys: ["k"]}
];

let useEnabledHotkeyNames = createGlobalState<Array<string>>([]);

export function useHotkey(name: string, callback: HotkeyCallback, dependencies: DependencyList, enabled: boolean = true): void {
  let [, setEnabledHotkeyNames] = useEnabledHotkeyNames();
  let keys = HOTKEY_SPECS.find((spec) => spec.name === name)?.keys ?? [];
  useEffect(() => {
    if (enabled) {
      Mousetrap.bind(keys, callback);
      setEnabledHotkeyNames((enabledNames) => [...enabledNames, name]);
      let cleanup = function (): void {
        Mousetrap.unbind(keys);
        setEnabledHotkeyNames((enabledNames) => enabledNames.filter((enabledName) => enabledName !== name));
      };
      return cleanup;
    }
  }, [enabled, ...dependencies]);
}

export function useHotkeySpecs(): Array<HotkeySpec> {
  let [enabledHotkeyNames] = useEnabledHotkeyNames();
  let specs = HOTKEY_SPECS.map((rawSpec) => {
    let enabled = enabledHotkeyNames.some((enabledName) => enabledName === rawSpec.name);
    return {...rawSpec, enabled};
  });
  return specs;
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

export type HotkeySpec = {name: string, group: HotkeyGroup, keys: Array<string>, enabled: boolean};
export type HotkeyCallback = (event: ExtendedKeyboardEvent, combo: string) => void;
export type HotkeyGroup = string;