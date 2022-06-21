//

import {
  Input
} from "/client/component/atom/input";
import {
  createTemplate
} from "/client/util/story";


export default {
  title: "Atom/Input",
  component: Input
};

const template = createTemplate(Input);

export const Normal = template.bind({});
Normal.args = {
  value: "Input"
};

export const WithLabel = template.bind({});
WithLabel.args = {
  value: "Input",
  label: "Label"
};

export const WithAffixes = template.bind({});
WithAffixes.args = {
  value: "Input",
  prefix: "#",
  suffix: "suffix"
};

export const Flexible = template.bind({});
Flexible.args = {
  value: "Password",
  type: "flexible"
};
