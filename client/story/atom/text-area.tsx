//

import * as react from "react";
import {
  useState
} from "react";
import {
  TextArea
} from "/client/component/atom/text-area";
import {
  createStory,
  createTemplate
} from "/client/util/story";


export default {
  title: "Atom/TextArea",
  component: TextArea,
  argTypes: {
    value: {control: {disable: true}}
  }
};

const template = createTemplate<typeof TextArea>((props) => {
  const [value, setValue] = useState(props.value);
  const node = (
    <TextArea {...props} value={value} onSet={(value) => (props.onSet?.(value), setValue(value))}/>
  );
  return node;
});

export const Normal = createStory(template);
Normal.args = {
  value: "TextArea\ntextarea textarea"
};

export const Labeled = createStory(template);
Labeled.args = {
  value: "TextArea\ntextarea textarea",
  label: "Label"
};

export const Monospace = createStory(template);
Monospace.args = {
  value: "TextArea\ntextarea textarea",
  font: "monospace"
};

export const Highlight = createStory(template);
Highlight.args = {
  value: "TextArea\ntextarea textarea",
  font: "monospace",
  language: "zatlin"
};