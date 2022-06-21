//

import {
  Checkbox
} from "/client/component/atom/checkbox";
import {
  createStory,
  createTemplate
} from "/client/util/story";


export default {
  title: "Atom/Checkbox",
  component: Checkbox
};

const template = createTemplate(Checkbox);

export const Alone = createStory(template);
Alone.args = {
  name: "alone"
};

export const AloneChecked = createStory(template);
AloneChecked.args = {
  name: "alone-checked",
  checked: true
};

export const Labeled = createStory(template);
Labeled.args = {
  name: "labeled",
  label: "Checkbox"
};

export const LabeledChecked = createStory(template);
LabeledChecked.args = {
  name: "labeled-checked",
  label: "Checkbox",
  checked: true
};