//

import * as react from "react";
import {
  ReactElement
} from "react";
import SuggestionPane from "/client/component-function/compound/suggestion-pane";
import {
  create
} from "/client/component-function/create";
import {
  Dictionary,
  Suggestion
} from "/client/skeleton/dictionary";


const SuggestionList = create(
  require("./suggestion-list.scss"), "SuggestionList",
  function ({
    dictionary,
    suggestions
  }: {
    dictionary: Dictionary,
    suggestions: Array<Suggestion>
  }): ReactElement | null {

    let suggestionPanes = suggestions.map((suggestion, index) => {
      let suggestionPane = (
        <SuggestionPane
          dictionary={dictionary}
          suggestion={suggestion}
          key={index}
        />
      );
      return suggestionPane;
    });
    let node = (suggestionPanes.length > 0) && (
      <ul styleName="root">
        {suggestionPanes}
      </ul>
    );
    return node || null;

  }
);


export default SuggestionList;