//

import {
  Badge
} from "/client/component/atom/badge";
import {
  createTemplate
} from "/client/util/story";


export default {
  title: "Atom/Badge",
  component: Badge
};

const template = createTemplate(Badge);

export const Number = template.bind({});
Number.args = {
  value: 5102
};

export const String = template.bind({});
String.args = {
  value: "Badge"
};