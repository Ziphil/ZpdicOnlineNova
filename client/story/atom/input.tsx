//

import {
  Input
} from "/client/component/atom/input";
import {
  createStory,
  createTemplate
} from "/client/util/story";


export default {
  title: "Atom/Input",
  component: Input
};

const template = createTemplate(Input);

export const Normal = createStory(template);
Normal.args = {
  value: "Input"
};

export const Labeled = createStory(template);
Labeled.args = {
  value: "Input",
  label: "Label"
};

export const WithAffixes = createStory(template);
WithAffixes.args = {
  value: "Input",
  prefix: "#",
  suffix: "suffix"
};

export const Flexible = createStory(template);
Flexible.args = {
  value: "Password",
  type: "flexible"
};
