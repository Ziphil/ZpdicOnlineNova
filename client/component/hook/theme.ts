//

import {
  useCallback
} from "react";
import {
  useMount
} from "react-use";
import {
  atom,
  useRecoilState
} from "recoil";


const themeAtom = atom({key: "theme", default: "light"});

export function useDefaultTheme(defaultTheme: string): void {
  const [, changeTheme] = useTheme();
  useMount(() => {
    const firstTheme = localStorage.getItem("theme") ?? defaultTheme;
    changeTheme(firstTheme);
  });
}

export function useTheme(): [string, ChangeThemeCallback] {
  const [theme, setTheme] = useRecoilState(themeAtom);
  const changeTheme = useCallback(function (theme: string): void {
    setTheme(theme);
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("theme", theme);
  }, [setTheme]);
  return [theme, changeTheme];
}

type ChangeThemeCallback = (theme: string) => void;