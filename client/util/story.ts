//

import {
  ComponentStory
} from "@storybook/react";
import {
  FunctionComponent,
  createElement
} from "react";


export function createTemplate<C extends FunctionComponent<any>>(component: C): ComponentStory<C> {
  const template = function (props: any): any {
    return createElement(component, props);
  };
  return template;
}

export function createStory<C extends FunctionComponent<any>>(template: ComponentStory<C>, name?: string): ComponentStory<C> {
  const story = template.bind({});
  if (name !== undefined) {
    story.storyName = name;
  }
  return story;
}