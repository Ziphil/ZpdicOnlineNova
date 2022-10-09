//

import {
  userEvent
} from "@storybook/testing-library";
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

const template = createTemplate<typeof Button>();

export const Normal = createStory(template, {
  args: {
    label: "Button",
    variant: "normal"
  }
});

export const Light = createStory(template, {
  args: {
    label: "Button",
    variant: "light"
  }
});

export const Link = createStory(template, {
  args: {
    label: "Button",
    variant: "link"
  }
});

export const Simple = createStory(template, {
  args: {
    label: "Button",
    variant: "simple"
  }
});

export const WithIcon = createStory(template, {
  args: {
    label: "Button",
    iconName: "thumbs-up"
  }
});

export const OnlyIcon = createStory(template, {
  args: {
    iconName: "heart"
  }
});

export const Loading = createStory(template, {
  args: {
    label: "Button",
    className: "zp-story-button",
    reactive: true,
    onClick: () => new Promise(() => null)
  },
  play: async ({canvasElement}) => {
    userEvent.click(canvasElement.getElementsByClassName("zp-story-button").item(0)!);
  }
});