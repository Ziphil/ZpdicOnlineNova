//

import {
  merge
} from "lodash-es";
import {
  ExampleEditor
} from "/client/component/compound/example-editor";
import {
  EnhancedDictionary
} from "/client/skeleton/dictionary";
import {
  DUMMY_DETAILED_DICTIONARY,
  DUMMY_EXAMPLE,
  DUMMY_ZATLIN_SOURCE
} from "/client/story/dummy";
import {
  createStory,
  createTemplate
} from "/client/util/story";


export default {
  title: "Compound/ExampleEditor",
  component: ExampleEditor
};

const template = createTemplate<typeof ExampleEditor>();

export const Basic = createStory(template, {
  args: {
    dictionary: EnhancedDictionary.enhance(merge(DUMMY_DETAILED_DICTIONARY, {
      settings: {
        zatlinSource: DUMMY_ZATLIN_SOURCE
      }
    })),
    example: DUMMY_EXAMPLE
  }
});