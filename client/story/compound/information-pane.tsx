//

import {
  InformationPane
} from "/client/component/compound/information-pane";
import {
  createDummyText
} from "/client/util/misc";
import {
  createStory,
  createTemplate
} from "/client/util/story";


export default {
  title: "Compound/InformationPane",
  component: InformationPane
};

const template = createTemplate<typeof InformationPane>();

export const Basic = createStory(template, {
  args: {
    texts: [createDummyText(2)],
    scheme: "red"
  }
});

export const Multiline = createStory(template, {
  args: {
    texts: [createDummyText(2), createDummyText(4), createDummyText(3)],
    scheme: "red"
  }
});