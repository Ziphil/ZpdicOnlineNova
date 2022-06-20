//

import {
  BaseDecorators,
  Parameters
} from "@storybook/addons";
import * as react from "react";
import {
  createElement
} from "react";
import SimpleRoot from "../client/component/simple-root";


export const parameters = {
  actions: {
    argTypesRegex: "^on[A-Z].*"
  },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /date$/i,
    }
  }
} as Parameters;

export const decorators = [
  (story) => (
    <SimpleRoot>
      <div id="story-wrapper">
        {createElement(story)}
      </div>
    </SimpleRoot>
  )
] as BaseDecorators<any>