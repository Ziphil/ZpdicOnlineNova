//

import {
  ComponentStoryObj
} from "@storybook/react";
import {
  FunctionComponent
} from "react";


export function createTemplate<C extends FunctionComponent<any>>(render?: ComponentStoryObj<C>["render"]): ComponentStoryObj<C> {
  return {render};
}

export function createStory<C extends FunctionComponent<any>>(template: ComponentStoryObj<C>, story?: ComponentStoryObj<C>): ComponentStoryObj<C> {
  const nextStory = {...template, ...story};
  return nextStory;
}