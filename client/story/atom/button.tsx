//

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

const template = createTemplate(Button);

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