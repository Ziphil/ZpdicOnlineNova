// @ts-nocheck

import {
  BaseDecorators,
  Parameters
} from "@storybook/addons";
import {
  createElement
} from "react";
import Root from "../client/story/story-root";


export const parameters = {
  actions: {
    argTypesRegex: "^on[A-Z].*"
  },
  grid: {
    cellSize: 16
  },
  themes: {
    default: "light",
    list: [
      {name: "light", class: "theme-light", color: "#F7F2ED"},
      {name: "dark", class: "theme-dark", color: "#2A241E"}
    ],
    target: "html"
  }
} as Parameters;

export const decorators = [
  (story) => (
    <Root>
      <div id="story-wrapper">
        {createElement(story)}
      </div>
    </Root>
  )
] as BaseDecorators<any>