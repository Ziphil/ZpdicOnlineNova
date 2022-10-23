//

import {
  useState
} from "react";
import {
  Input,
  SuggestionSpec
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
    value: "Input"
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

export const Validation = createStory(template, {
  args: {
    value: "Input",
    validate: (value) => (value === "") ? {scheme: "red", iconName: "triangle-exclamation", message: "Should not be empty."} : {scheme: "primary", iconName: "circle-check", message: "Looks good."}
  }
});

export const SyncSuggestion = createStory(template, {
  args: {
    value: "Input",
    suggest
  }
});

export const AsyncSuggestion = createStory(template, {
  args: {
    value: "Input",
    suggest: (pattern) => new Promise((resolve) => setInterval(() => resolve(suggest(pattern)), 500))
  }
});

function suggest(pattern: string): Array<SuggestionSpec> {
  const candidates = ["Apple", "Banana", "Grape", "Orange"];
  const suggestionSpecs = candidates.filter((candidate) => candidate.includes(pattern)).map((candidate) => ({replacement: candidate, node: candidate}));
  return suggestionSpecs;
}