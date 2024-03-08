//

import {useCallback} from "react";
import {atom, useRecoilValue, useSetRecoilState} from "recoil";
import {ColorDefinitions} from "zographia";
import {COLOR_DEFINITIONS} from "/client-new/constant/appearance";


const appearanceAtom = atom<Appearance>({
  key: "colorDefinitionType",
  default: "normal"
});

export function useColorDefinitions(): ColorDefinitions {
  const type = useRecoilValue(appearanceAtom);
  return COLOR_DEFINITIONS[type];
}

export function useAppearance(): Appearance {
  const appearance = useRecoilValue(appearanceAtom);
  return appearance;
}

export function useChangeAppearance(): (appearance: Appearance) => void {
  const setAppearance = useSetRecoilState(appearanceAtom);
  const changeAppearance = useCallback(function (type: Appearance) {
    setAppearance(type);
  }, [setAppearance]);
  return changeAppearance;
}

export const APPEARANCES = ["normal", "dimmed"] as const;
export type Appearance = (typeof APPEARANCES)[number];

export const THEMES = ["light"] as const;
export type Theme = (typeof THEMES)[number];
