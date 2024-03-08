//

import {ColorDefinitions, createColor, createColorDefinition} from "zographia";


export const COLOR_DEFINITIONS = {
  normal: {
    primary: createColorDefinition("hsl(30, 80%, 50%)", {
      dark: {mix: 0.5, saturation: -0.1},
      light: {mix: 0.91, saturation: 0.3}
    }),
    secondary: createColorDefinition("hsl(15, 75%, 55%)", {
      dark: {mix: 0.5, saturation: -0.1},
      light: {mix: 0.93, saturation: 0.3}
    }),
    blue: createColorDefinition("hsl(220, 75%, 50%)", {
      dark: {mix: 0.5, saturation: -0.1},
      light: {mix: 0.93, saturation: 0.3}
    }),
    red: createColorDefinition("hsl(0, 65%, 55%)", {
      dark: {mix: 0.5, saturation: -0.1},
      light: {mix: 0.94, saturation: 0.3}
    }),
    green: createColorDefinition("hsl(140, 55%, 45%)", {
      dark: {mix: 0.5, saturation: -0.1},
      light: {mix: 0.93, saturation: 0.3}
    }),
    yellow: createColorDefinition("hsl(60, 70%, 50%)", {
      dark: {mix: 0.5, saturation: -0.1},
      light: {mix: 0.9, saturation: 0.3}
    }),
    purple: createColorDefinition("hsl(280, 55%, 55%)", {
      dark: {mix: 0.5, saturation: -0.1},
      light: {mix: 0.94, saturation: 0.3}
    }),
    cyan: createColorDefinition("hsl(190, 70%, 50%)", {
      dark: {mix: 0.5, saturation: -0.1},
      light: {mix: 0.93, saturation: 0.3}
    }),
    orange: createColorDefinition("hsl(30, 80%, 50%)", {
      dark: {mix: 0.5, saturation: -0.1},
      light: {mix: 0.91, saturation: 0.3}
    }),
    gray: createColorDefinition("hsl(30, 5%, 55%)", {
      dark: {mix: 0.55, saturation: -0.1},
      light: {mix: 0.92, saturation: 0.2}
    }),
    white: createColor("hsl(30, 100%, 100%)"),
    backgroundLight: createColor("hsl(30, 30%, 99%)"),
    textLight: createColor("hsl(30, 30%, 10%)"),
    stainLight: createColor("hsla(30, 30%, 50%)"),
    black: createColor("hsl(30, 0%, 0%)"),
    backgroundDark: createColor("hsl(30, 50%, 15%)"),
    textDark: createColor("hsl(30, 100%, 98%)"),
    stainDark: createColor("hsla(30, 50%, 0%)")
  },
  dimmed: {
    primary: createColorDefinition("hsl(30, 60%, 45%)", {
      dark: {mix: 0.5, saturation: -0.1},
      light: {mix: 0.91, saturation: 0.3}
    }),
    secondary: createColorDefinition("hsl(15, 55%, 50%)", {
      dark: {mix: 0.5, saturation: -0.1},
      light: {mix: 0.93, saturation: 0.3}
    }),
    blue: createColorDefinition("hsl(220, 55%, 45%)", {
      dark: {mix: 0.5, saturation: -0.1},
      light: {mix: 0.93, saturation: 0.3}
    }),
    red: createColorDefinition("hsl(0, 45%, 50%)", {
      dark: {mix: 0.5, saturation: -0.1},
      light: {mix: 0.94, saturation: 0.3}
    }),
    green: createColorDefinition("hsl(140, 35%, 40%)", {
      dark: {mix: 0.5, saturation: -0.1},
      light: {mix: 0.93, saturation: 0.3}
    }),
    yellow: createColorDefinition("hsl(60, 50%, 45%)", {
      dark: {mix: 0.5, saturation: -0.1},
      light: {mix: 0.9, saturation: 0.3}
    }),
    purple: createColorDefinition("hsl(280, 35%, 50%)", {
      dark: {mix: 0.5, saturation: -0.1},
      light: {mix: 0.94, saturation: 0.3}
    }),
    cyan: createColorDefinition("hsl(190, 50%, 45%)", {
      dark: {mix: 0.5, saturation: -0.1},
      light: {mix: 0.93, saturation: 0.3}
    }),
    orange: createColorDefinition("hsl(30, 60%, 45%)", {
      dark: {mix: 0.5, saturation: -0.1},
      light: {mix: 0.91, saturation: 0.3}
    }),
    gray: createColorDefinition("hsl(30, 3%, 50%)", {
      dark: {mix: 0.55, saturation: -0.1},
      light: {mix: 0.92, saturation: 0.2}
    }),
    white: createColor("hsl(30, 30%, 98%)"),
    backgroundLight: createColor("hsl(30, 20%, 96%)"),
    textLight: createColor("hsl(30, 30%, 20%)"),
    stainLight: createColor("hsla(30, 30%, 50%)"),
    black: createColor("hsl(30, 0%, 0%)"),
    backgroundDark: createColor("hsl(30, 50%, 15%)"),
    textDark: createColor("hsl(30, 100%, 98%)"),
    stainDark: createColor("hsla(30, 50%, 0%)")
  }
} satisfies Record<string, ColorDefinitions>;