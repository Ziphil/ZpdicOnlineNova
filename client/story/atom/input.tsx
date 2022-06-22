//

import * as react from "react";
import {
  useState
} from "react";
import {
  Input
} from "/client/component/atom/input";
import {
  createStory,
  createTemplate
} from "/client/util/story";


export default {
  title: "Atom/Input",
  component: Input,
  argTypes: {
    value: {control: {disable: true}}
  }
};

const template = createTemplate<typeof Input>((props) => {
  const [value, setValue] = useState(props.value);
  const node = (
    <Input {...props} value={value} onSet={(value) => (props.onSet?.(value), setValue(value))}/>
  );
  return node;
});

export const Normal = createStory(template, {
  args: {
    value: "Input",
    label: "Label"
  }
});

export const Labeled = createStory(template, {
  args: {
    value: "Input",
    label: "Label"
  }
});

export const WithAffixes = createStory(template, {
  args: {
    value: "Input",
    prefix: "#",
    suffix: "suffix"
  }
});

export const Flexible = createStory(template, {
  args: {
    value: "Password",
    type: "flexible"
  }
});
