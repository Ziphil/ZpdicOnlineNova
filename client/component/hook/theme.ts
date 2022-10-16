//

import {
  useCallback
} from "react";
import {
  createGlobalState,
  useMount
} from "react-use";


const useRawTheme = createGlobalState("light");

export function useDefaultTheme(defaultTheme: string): void {
  const [, changeTheme] = useTheme();
  useMount(() => {
    const firstTheme = localStorage.getItem("theme") ?? defaultTheme;
    changeTheme(firstTheme);
  });
}

export function useTheme(): [string, ChangeThemeCallback] {
  const [theme, setTheme] = useRawTheme();
  const changeTheme = useCallback(function (theme: string): void {
    setTheme(theme);
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("theme", theme);
  }, [setTheme]);
  return [theme, changeTheme];
}

type ChangeThemeCallback = (theme: string) => void;