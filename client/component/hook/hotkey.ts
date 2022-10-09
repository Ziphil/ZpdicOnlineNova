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
  {name: "showHotkeyHelp", group: "general", subgroup: 0, keys: ["?"]},
  {name: "unfocus", group: "general", subgroup: 0, keys: ["esc"]},
  {name: "jumpDashboardPage", group: "navigation", subgroup: 0, keys: ["g u"]},
  {name: "jumpDictionaryListPage", group: "navigation", subgroup: 0, keys: ["g l"]},
  {name: "jumpNotificationPage", group: "navigation", subgroup: 0, keys: ["g n"]},
  {name: "jumpDocumentPage", group: "navigation", subgroup: 0, keys: ["g h"]},
  {name: "jumpContactPage", group: "navigation", subgroup: 0, keys: ["g c"]},
  {name: "jumpDictionaryPage", group: "navigation", subgroup: 1, keys: ["g d"]},
  {name: "jumpDictionarySettingPage", group: "navigation", subgroup: 1, keys: ["g s"]},
  {name: "jumpExamplePage", group: "navigation", subgroup: 1, keys: ["g x"]},
  {name: "addWord", group: "editDictionary", subgroup: 0, keys: ["a w"]},
  {name: "addExample", group: "editDictionary", subgroup: 0, keys: ["a x"]},
  {name: "addCommission", group: "editDictionary", subgroup: 0, keys: ["r"]},
  {name: "toggleWordEditor", group: "editDictionary", subgroup: 1, keys: ["w"]},
  {name: "toggleExampleEditor", group: "editDictionary", subgroup: 1, keys: ["x"]},
  {name: "focusSearch", group: "searchWords", subgroup: 0, keys: ["s"]},
  {name: "movePreviousPage", group: "searchWords", subgroup: 1, keys: ["j"]},
  {name: "moveNextPage", group: "searchWords", subgroup: 1, keys: ["k"]},
  {name: "changeSearchModeToBoth", group: "searchWords", subgroup: 2, keys: ["u"]},
  {name: "changeSearchModeToName", group: "searchWords", subgroup: 2, keys: ["i"]},
  {name: "changeSearchModeToEquivalent", group: "searchWords", subgroup: 2, keys: ["o"]},
  {name: "changeSearchModeToContent", group: "searchWords", subgroup: 2, keys: ["p"]},
  {name: "changeSearchTypeToPrefix", group: "searchWords", subgroup: 3, keys: ["v"]},
  {name: "changeSearchTypeToPart", group: "searchWords", subgroup: 3, keys: ["b"]},
  {name: "changeSearchTypeToExact", group: "searchWords", subgroup: 3, keys: ["n"]},
  {name: "changeSearchTypeToRegular", group: "searchWords", subgroup: 3, keys: ["m"]}
];

const useEnabledHotkeyNames = createGlobalState<Array<string>>([]);

export function useHotkey(name: string, callback: HotkeyCallback, dependencies: DependencyList, enabled: boolean = true): void {
  const [, setEnabledHotkeyNames] = useEnabledHotkeyNames();
  const keys = HOTKEY_SPECS.find((spec) => spec.name === name)?.keys ?? [];
  useEffect(() => {
    if (enabled) {
      Mousetrap.bind(keys, callback);
      setEnabledHotkeyNames((enabledNames) => [...enabledNames, name]);
      return () => {
        Mousetrap.unbind(keys);
        setEnabledHotkeyNames((enabledNames) => enabledNames.filter((enabledName) => enabledName !== name));
      };
    } else {
      return undefined;
    }
  }, [enabled, ...dependencies]);
}

export function useHotkeySpecs(): Array<HotkeySpec> {
  const [enabledHotkeyNames] = useEnabledHotkeyNames();
  const specs = HOTKEY_SPECS.map((rawSpec) => {
    const enabled = enabledHotkeyNames.some((enabledName) => enabledName === rawSpec.name);
    return {...rawSpec, enabled};
  });
  return specs;
}

Mousetrap.prototype.stopCallback = function (event: ExtendedKeyboardEvent, element: any, combo: string): boolean {
  const tagName = element.tagName.toLowerCase();
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

export type HotkeySpec = {name: string, group: HotkeyGroup, subgroup: number, keys: Array<string>, enabled: boolean};
export type HotkeyCallback = (event: ExtendedKeyboardEvent, combo: string) => void;
export type HotkeyGroup = string;