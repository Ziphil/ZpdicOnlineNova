//

import {
  WordSearchForm
} from "/client/component/compound/word-search-form";
import {
  DUMMY_DICTIONARY
} from "/client/story/dummy";
import {
  createStory,
  createTemplate
} from "/client/util/story";


export default {
  title: "Compound/WordSearchForm",
  component: WordSearchForm
};

const template = createTemplate<typeof WordSearchForm>();

export const Basic = createStory(template, {
  args: {
    dictionary: DUMMY_DICTIONARY
  }
});

export const WithOthers = createStory(template, {
  args: {
    dictionary: DUMMY_DICTIONARY,
    showOrder: true,
    showAdvancedSearch: true
  }
});