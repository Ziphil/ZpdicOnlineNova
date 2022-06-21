//

import {
  Radio
} from "/client/component/atom/radio";
import {
  createStory,
  createTemplate
} from "/client/util/story";


export default {
  title: "Atom/Radio",
  component: Radio
};

const template = createTemplate(Radio);

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
  label: "Radio"
};

export const LabeledChecked = createStory(template);
LabeledChecked.args = {
  name: "labeled-checked",
  label: "Radio",
  checked: true
};