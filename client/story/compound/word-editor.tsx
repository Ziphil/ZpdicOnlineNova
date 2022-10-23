//

import {
  merge
} from "lodash-es";
import {
  WordEditor
} from "/client/component/compound/word-editor";
import {
  EnhancedDictionary
} from "/client/skeleton/dictionary";
import {
  DUMMY_DETAILED_DICTIONARY,
  DUMMY_WORD,
  DUMMY_ZATLIN_SOURCE
} from "/client/story/dummy";
import {
  createStory,
  createTemplate
} from "/client/util/story";


export default {
  title: "Compound/WordEditor",
  component: WordEditor
};

const template = createTemplate<typeof WordEditor>();

export const Basic = createStory(template, {
  args: {
    dictionary: EnhancedDictionary.enhance(merge(DUMMY_DETAILED_DICTIONARY, {
      settings: {
        zatlinSource: DUMMY_ZATLIN_SOURCE
      }
    })),
    word: DUMMY_WORD
  }
});