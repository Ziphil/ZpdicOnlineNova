//

import * as react from "react";
import {
  useState
} from "react";
import DropdownItem from "/client/component/atom/dropdown-item";
import {
  Selection
} from "/client/component/atom/selection-beta";
import {
  createStory,
  createTemplate
} from "/client/util/story";


export default {
  title: "Atom/Selection",
  component: Selection
};

const template = createTemplate<typeof Selection>((props) => {
  const [value, setValue] = useState(props.value);
  const node = (
    <Selection {...props} value={value} onSet={setValue}/>
  );
  return node;
});

export const Basic = createStory(template, {
  args: {
    value: "1",
    children: [
      <DropdownItem key="1" value="1">Item 1</DropdownItem>,
      <DropdownItem key="2" value="2">Item 2</DropdownItem>,
      <DropdownItem key="3" value="3">Item 3</DropdownItem>
    ]
  }
});

export const Labeled = createStory(template, {
  args: {
    value: "1",
    label: "Label",
    children: [
      <DropdownItem key="1" value="1">Item 1</DropdownItem>,
      <DropdownItem key="2" value="2">Item 2</DropdownItem>,
      <DropdownItem key="3" value="3">Item 3</DropdownItem>
    ]
  }
});
