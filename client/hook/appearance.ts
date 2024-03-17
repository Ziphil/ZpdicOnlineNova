//

import {useCallback, useEffect} from "react";
import {atom, useRecoilValue, useSetRecoilState} from "recoil";
import {ColorDefinitions} from "zographia";
import {Appearance, AppearanceUtil, COLOR_DEFINITIONS} from "/client/constant/appearance";


const appearanceAtom = atom<Appearance>({
  key: "colorDefinitionType",
  default: AppearanceUtil.cast(localStorage.getItem("zp-appearance") ?? "normal")
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
  const changeAppearance = useCallback(function (appearance: Appearance) {
    setAppearance(appearance);
    localStorage.setItem("zp-appearance", appearance);
  }, [setAppearance]);
  return changeAppearance;
}

export function useDefaultAppearance(initialAppearance: string): void {
  const changeAppearance = useChangeAppearance();
  useEffect(() => {
    const appearance = AppearanceUtil.cast(localStorage.getItem("zp-appearance") ?? "normal");
    changeAppearance(appearance);
  }, [initialAppearance, changeAppearance]);
}