//

import {
  Button
} from "/client/component/atom/button";
import {
  createTemplate
} from "/client/util/story";


export default {
  title: "Atom/Button",
  component: Button
};

const template = createTemplate(Button);

export const Normal = template.bind({});
Normal.args = {
  label: "Button",
  variant: "normal"
};

export const Light = template.bind({});
Light.args = {
  label: "Button",
  variant: "light"
};

export const Link = template.bind({});
Link.args = {
  label: "Button",
  variant: "link"
};