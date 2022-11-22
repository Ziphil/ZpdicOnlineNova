//

import {
  AdvancedWordSearchForm
} from "/client/component/compound/advanced-word-search-form";
import {
  DUMMY_ADVANCED_WORD_PARAMETER,
  DUMMY_DICTIONARY
} from "/client/story/dummy";
import {
  createStory,
  createTemplate
} from "/client/util/story";


export default {
  title: "Compound/AdvancedWordSearchForm",
  component: AdvancedWordSearchForm
};

const template = createTemplate<typeof AdvancedWordSearchForm>();

export const Basic = createStory(template, {
  args: {
    dictionary: DUMMY_DICTIONARY,
    defaultParameter: DUMMY_ADVANCED_WORD_PARAMETER,
    open: true
  }
});