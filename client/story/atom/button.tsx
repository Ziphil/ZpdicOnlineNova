//

import {
  StoryContext
} from "@storybook/react";
import {
  userEvent
} from "@storybook/testing-library";
import * as react from "react";
import {
  Button
} from "/client/component/atom/button";
import {
  createStory,
  createTemplate
} from "/client/util/story";


export default {
  title: "Atom/Button",
  component: Button
};

const template = createTemplate<typeof Button>((props) => <Button {...props}/>);

export const Normal = createStory(template);
Normal.args = {
  label: "Button",
  variant: "normal"
};

export const Light = createStory(template);
Light.args = {
  label: "Button",
  variant: "light"
};

export const Link = createStory(template);
Link.args = {
  label: "Button",
  variant: "link"
};

export const Simple = createStory(template);
Simple.args = {
  label: "Button",
  variant: "simple"
};

export const Loading = createStory(template);
Loading.args = {
  label: "Button",
  className: "zp-story-button",
  reactive: true,
  onClick: () => new Promise(() => null)
};
Loading.play = async function ({canvasElement}: StoryContext<any, any>): Promise<void> {
  userEvent.click(canvasElement.getElementsByClassName("zp-story-button").item(0)!);
};