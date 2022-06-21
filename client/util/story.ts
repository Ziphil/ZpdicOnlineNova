//

import {
  ComponentStory,
  Story
} from "@storybook/react";
import {
  ComponentProps,
  FunctionComponent
} from "react";


export function createTemplate<C extends FunctionComponent<any>>(story: Story<ComponentProps<C>>): ComponentStory<C> {
  return story;
}

export function createStory<C extends FunctionComponent<any>>(template: ComponentStory<C>, name?: string): ComponentStory<C> {
  const story = template.bind({});
  if (name !== undefined) {
    story.storyName = name;
  }
  return story;
}