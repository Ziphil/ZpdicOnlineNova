//

import {
  Badge
} from "/client/component/atom/badge";
import {
  createStory,
  createTemplate
} from "/client/util/story";


export default {
  title: "Atom/Badge",
  component: Badge
};

const template = createTemplate<typeof Badge>();

export const Number = createStory(template, {
  args: {
    value: 5102
  }
});

export const String = createStory(template, {
  args: {
    value: "Badge"
  }
});