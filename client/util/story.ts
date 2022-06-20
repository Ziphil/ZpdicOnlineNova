//

import {
  ComponentStory
} from "@storybook/react";
import {
  FunctionComponent,
  createElement
} from "react";


export function createTemplate<C extends FunctionComponent<any>>(component: C): ComponentStory<C> {
  const story = function (props: any): any {
    return createElement(component, props);
  };
  return story;
}