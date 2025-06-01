//

import {useCallback} from "react";
import {atom, useRecoilValue, useSetRecoilState} from "recoil";
import {ColorDefinitions, useChangeTheme, useTheme} from "zographia";
import {Appearance, AppearanceFontUtil, AppearanceSchemeUtil, COLOR_DEFINITIONS} from "/client/constant/appearance";


const appearanceAtom = atom<Omit<Appearance, "theme">>({
  key: "appearance",
  default: {
    scheme: AppearanceSchemeUtil.cast(localStorage.getItem("zp-appearance") ?? "normal"),
    font: AppearanceFontUtil.cast(localStorage.getItem("zp-font") ?? "sans")
  }
});

export function useColorDefinitions(): ColorDefinitions {
  const appearance = useRecoilValue(appearanceAtom);
  return COLOR_DEFINITIONS[appearance.scheme];
}

export function useAppearance(): Appearance {
  const appearance = useRecoilValue(appearanceAtom);
  const theme = useTheme();
  return {...appearance, theme};
}

export function useChangeAppearance(): (appearance: Appearance) => void {
  const setAppearance = useSetRecoilState(appearanceAtom);
  const chageTheme = useChangeTheme();
  const changeAppearance = useCallback(function (appearance: Appearance): void {
    setAppearance(appearance);
    chageTheme(appearance.theme);
    localStorage.setItem("zp-appearance", appearance.scheme);
    localStorage.setItem("zp-font", appearance.font);
  }, [setAppearance, chageTheme]);
  return changeAppearance;
}