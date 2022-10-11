// @ts-nocheck

import {
  BaseDecorators,
  Parameters
} from "@storybook/addons";
import * as react from "react";
import {
  createElement
} from "react";
import StoryRoot from "../client/story/story-root";


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
      {name: "dark", class: "theme-dark", color: "#000000"}
    ],
    target: "html"
  }
} as Parameters;

export const decorators = [
  (story) => (
    <StoryRoot>
      <div id="story-wrapper">
        {createElement(story)}
      </div>
    </StoryRoot>
  )
] as BaseDecorators<any>