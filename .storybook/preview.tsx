//

import {
  library as fontawesomeLibrary
} from "@fortawesome/fontawesome-svg-core";
import {
  faGithub as iconFaGithub
} from "@fortawesome/free-brands-svg-icons";
import {
  fas as iconFas
} from "@fortawesome/free-solid-svg-icons";
import {
  BaseDecorators,
  Parameters
} from "@storybook/addons";
import * as react from "react";
import {
  createElement
} from "react";
import SimpleRoot from "../client/component/simple-root";


fontawesomeLibrary.add(iconFas, iconFaGithub);

export const parameters = {
  actions: {
    argTypesRegex: "^on[A-Z].*"
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