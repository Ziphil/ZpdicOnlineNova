//

import * as react from "react";
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

const template = createTemplate<typeof Radio>((props) => <Radio {...props}/>);

export const Alone = createStory(template);
Alone.args = {
  checked: true,
  name: "alone"
};

export const Labeled = createStory(template);
Labeled.args = {
  checked: true,
  name: "labeled",
  label: "Radio"
};