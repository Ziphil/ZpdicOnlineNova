//

import * as react from "react";
import {
  useState
} from "react";
import Radio from "/client/component/atom/radio-beta";
import {
  RadioGroup
} from "/client/component/atom/radio-group-beta";
import {
  createStory,
  createTemplate
} from "/client/util/story";


export default {
  title: "Atom/RadioGroup",
  component: RadioGroup
};

const template = createTemplate<typeof RadioGroup>((props) => {
  const [value, setValue] = useState(props.value);
  const node = (
    <RadioGroup {...props} value={value} onSet={setValue}>
      <Radio value="1" label="Radio 1"/>
      <Radio value="2" label="Radio 2"/>
      <Radio value="3" label="Radio 3"/>
    </RadioGroup>
  );
  return node;
});

export const Alone = createStory(template, {
  args: {
    name: "alone"
  }
});