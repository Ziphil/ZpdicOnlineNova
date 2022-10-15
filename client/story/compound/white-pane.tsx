//

import Button from "/client/component/atom/button";
import {
  WhitePane
} from "/client/component/compound/white-pane";
import {
  createDummyText
} from "/client/util/misc";
import {
  createStory,
  createTemplate
} from "/client/util/story";


export default {
  title: "Compound/WhitePane",
  component: WhitePane
};

const template = createTemplate<typeof WhitePane>();

export const Basic = createStory(template, {
  args: {
    children: createDummyText(5)
  }
});

export const WithFooter = createStory(template, {
  args: {
    children: [
      <div key="0">{createDummyText(5)}</div>,
      <div key="1" style={{display: "flex", columnGap: "0.75rem"}}><Button label="Button"/><Button label="Button"/><Button label="Button"/></div>
    ]
  }
});

export const Clickable = createStory(template, {
  args: {
    clickable: true,
    children: createDummyText(5)
  }
});