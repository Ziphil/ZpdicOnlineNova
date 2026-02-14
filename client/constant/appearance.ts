//

import {ColorDefinitions, StyleDefinitions, createColor, createColorDefinition} from "zographia";
import {LiteralType, LiteralUtilType} from "/server/util/literal-type";


export const COLOR_DEFINITIONS = {
  normal: {
    primary: createColorDefinition("oklch(70% 40% 58)", "oklch(35% 20% 58)"),
    secondary: createColorDefinition("oklch(65% 45% 38)", "oklch(35% 20% 38)"),
    blue: createColorDefinition("oklch(55% 50% 260)", "oklch(35% 20% 260)"),
    red: createColorDefinition("oklch(55% 50% 15)", "oklch(35% 20% 15)"),
    green: createColorDefinition("oklch(60% 35% 150)", "oklch(35% 20% 150)"),
    yellow: createColorDefinition("oklch(75% 40% 110)", "oklch(35% 20% 110)"),
    purple: createColorDefinition("oklch(55% 50% 310)", "oklch(35% 20% 310)"),
    cyan: createColorDefinition("oklch(70% 30% 215)", "oklch(35% 20% 215)"),
    orange: createColorDefinition("oklch(70% 40% 55)", "oklch(35% 20% 55)"),
    gray: createColorDefinition("oklch(65% 2% 58)", "oklch(35% 2% 58)"),
    white: createColor("oklch(100% 0% 58)"),
    black: createColor("black"),
    textLight: createColor("oklch(22% 5% 58)"),
    textDark: createColor("oklch(99% 2% 58)"),
    backgroundLight: createColor("oklch(99% 0% 58)"),
    stainLight: createColor("oklch(63% 18% 58)"),
    backgroundDark: createColor("oklch(30% 10% 58)"),
    stainDark: createColor("black")
  },
  dimmed: {
    primary: createColorDefinition("oklch(60% 35% 58)", "oklch(30% 15% 58)"),
    secondary: createColorDefinition("oklch(55% 40% 38)", "oklch(30% 15% 38)"),
    blue: createColorDefinition("oklch(45% 45% 260)", "oklch(30% 15% 260)"),
    red: createColorDefinition("oklch(45% 45% 15)", "oklch(30% 15% 15)"),
    green: createColorDefinition("oklch(50% 30% 150)", "oklch(30% 15% 150)"),
    yellow: createColorDefinition("oklch(65% 35% 110)", "oklch(30% 15% 110)"),
    purple: createColorDefinition("oklch(45% 45% 310)", "oklch(30% 15% 310)"),
    cyan: createColorDefinition("oklch(60% 25% 215)", "oklch(30% 15% 215)"),
    orange: createColorDefinition("oklch(60% 35% 55)", "oklch(30% 15% 55)"),
    gray: createColorDefinition("oklch(55% 2% 58)", "oklch(30% 2% 58)"),
    white: createColor("oklch(98% 0% 58)"),
    black: createColor("black"),
    textLight: createColor("oklch(22% 5% 58)"),
    textDark: createColor("oklch(99% 2% 58)"),
    backgroundLight: createColor("oklch(97% 0% 58)"),
    stainLight: createColor("oklch(63% 18% 58)"),
    backgroundDark: createColor("oklch(30% 10% 58)"),
    stainDark: createColor("black")
  }
} satisfies Record<string, ColorDefinitions>;

export const STYLE_DEFINITIONS = {
  sans: {
    fontFamily: {
      main: "'Noto Sans', 'Noto Sans JP', sans-serif",
      bold: "'Noto Sans', 'Noto Sans JP', sans-serif",
      monospace: "'Noto Sans Mono', 'Noto Sans JP', monospace"
    }
  },
  serif: {
    fontFamily: {
      main: "'Noto Serif', 'Noto Serif JP', serif",
      bold: "'Noto Serif', 'Noto Serif JP', serif",
      monospace: "'Noto Sans Mono', 'Noto Sans JP', monospace"
    }
  }
} satisfies Record<string, Partial<StyleDefinitions>>;

export type Appearance = {
  theme: Theme,
  scheme: AppearanceScheme,
  font: AppearanceFont
};

export const APPEARANCE_SCHEMES = ["normal", "dimmed"] as const;
export type AppearanceScheme = LiteralType<typeof APPEARANCE_SCHEMES>;
export const AppearanceSchemeUtil = LiteralUtilType.create(APPEARANCE_SCHEMES);

export const APPEARANCE_FONTS = ["sans", "serif"] as const;
export type AppearanceFont = LiteralType<typeof APPEARANCE_FONTS>;
export const AppearanceFontUtil = LiteralUtilType.create(APPEARANCE_FONTS);

export const THEMES = ["light"] as const;
export type Theme = (typeof THEMES)[number];