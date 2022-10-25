//

import {
  useState
} from "react";
import {
  MultiInput,
  SuggestionSpec
} from "/client/component/atom/multi-input";
import {
  createStory,
  createTemplate
} from "/client/util/story";


export default {
  title: "Atom/MultiInput",
  component: MultiInput,
  argTypes: {
    value: {control: {disable: true}}
  }
};

const template = createTemplate<typeof MultiInput>((props) => {
  const [values, setValues] = useState(props.values);
  const node = (
    <MultiInput {...props} values={values} onSet={(values) => (props.onSet?.(values), setValues(values))}/>
  );
  return node;
});

export const Normal = createStory(template, {
  args: {
    values: ["Value 1", "Value 2", "Value 3"]
  }
});

export const Labeled = createStory(template, {
  args: {
    values: ["Value 1", "Value 2", "Value 3"],
    label: "Label"
  }
});

export const ManyValues = createStory(template, {
  args: {
    values: Array.from({length: 50}).map((dummy, index) => `Value ${index + 1}`),
    label: "Label"
  }
});

export const WithAffixes = createStory(template, {
  args: {
    values: ["Value 1", "Value 2", "Value 3"],
    prefix: "#",
    suffix: "suffix"
  }
});

export const Validation = createStory(template, {
  args: {
    values: ["Value 1", "Value 2", "Value 3"],
    validate: (values) => (values.length <= 0) ? {scheme: "red", iconName: "triangle-exclamation", message: "Should not be empty."} : {scheme: "primary", iconName: "circle-check", message: "Looks good."}
  }
});

export const SyncSuggestion = createStory(template, {
  args: {
    values: ["Value 1", "Value 2", "Value 3"],
    suggest
  }
});

export const AsyncSuggestion = createStory(template, {
  args: {
    values: ["Value 1", "Value 2", "Value 3"],
    suggest: (pattern) => new Promise((resolve) => setInterval(() => resolve(suggest(pattern)), 500))
  }
});

function suggest(pattern: string): Array<SuggestionSpec> {
  const candidates = ["Apple", "Banana", "Grape", "Orange"];
  const suggestionSpecs = candidates.filter((candidate) => candidate.includes(pattern)).map((candidate) => ({replacement: candidate, node: candidate}));
  return suggestionSpecs;
}