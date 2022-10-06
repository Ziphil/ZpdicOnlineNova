//

import * as react from "react";
import {
  Fragment,
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
    <RadioGroup {...props} value={value} onSet={setValue}/>
  );
  return node;
});

export const Basic = createStory(template, {
  args: {
    name: "basic",
    withContainer: true,
    value: "1",
    children: (
      <Fragment>
        <Radio value="1" label="Radio 1"/>
        <Radio value="2" label="Radio 2"/>
        <Radio value="3" label="Radio 3"/>
      </Fragment>
    )
  }
});

export const Boolean = createStory(template, {
  args: {
    name: "boolean",
    withContainer: true,
    value: true,
    children: (
      <Fragment>
        <Radio value={true} label="True"/>
        <Radio value={false} label="False"/>
      </Fragment>
    )
  }
});