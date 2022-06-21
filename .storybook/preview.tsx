//

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