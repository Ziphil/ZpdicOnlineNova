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

const template = createTemplate<typeof Radio>();

export const Alone = createStory(template, {
  args: {
  }
});

export const Labeled = createStory(template, {
  args: {
    label: "Radio"
  }
});