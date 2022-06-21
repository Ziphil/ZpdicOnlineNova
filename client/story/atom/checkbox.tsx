//

import * as react from "react";
import {
  useState
} from "react";
import {
  Checkbox
} from "/client/component/atom/checkbox";
import {
  createStory,
  createTemplate
} from "/client/util/story";


export default {
  title: "Atom/Checkbox",
  component: Checkbox,
  argTypes: {
    checked: {control: {disable: true}}
  }
};

const template = createTemplate<typeof Checkbox>((props) => {
  const [checked, setChecked] = useState(props.checked);
  const node = (
    <Checkbox {...props} checked={checked} onSet={(checked) => (props.onSet?.(checked), setChecked(checked))}/>
  );
  return node;
});

export const Alone = createStory(template);
Alone.args = {
  checked: true,
  name: "alone"
};

export const Labeled = createStory(template);
Labeled.args = {
  checked: true,
  name: "labeled",
  label: "Checkbox"
};