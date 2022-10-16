//

import {
  Menu
} from "/client/component/compound/menu";
import MenuItem from "/client/component/compound/menu-item";
import {
  createStory,
  createTemplate
} from "/client/util/story";


export default {
  title: "Compound/Menu",
  component: Menu
};

const template = createTemplate<typeof Menu>();

export const Horizontal = createStory(template, {
  args: {
    direction: "horizontal",
    mode: "2",
    children: [
      <MenuItem key="1" mode="1" label="Menu 1" iconName="a"/>,
      <MenuItem key="2" mode="2" label="Menu 2" iconName="b"/>,
      <MenuItem key="3" mode="3" label="Menu 3" iconName="c"/>,
      <MenuItem key="4" mode="4" label="Menu 4" iconName="d"/>,
      <MenuItem key="5" mode="5" label="Menu 5" iconName="e"/>
    ]
  }
});

export const Vertical = createStory(template, {
  args: {
    direction: "vertical",
    mode: "2",
    children: [
      <MenuItem key="1" mode="1" label="Menu 1" iconName="a"/>,
      <MenuItem key="2" mode="2" label="Menu 2" iconName="b"/>,
      <MenuItem key="3" mode="3" label="Menu 3" iconName="c"/>,
      <MenuItem key="4" mode="4" label="Menu 4" iconName="d"/>,
      <MenuItem key="5" mode="5" label="Menu 5" iconName="e"/>
    ]
  }
});