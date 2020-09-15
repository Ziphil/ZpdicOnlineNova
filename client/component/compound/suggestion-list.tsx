//

import * as react from "react";
import {
  ReactNode
} from "react";
import Component from "/client/component/component";
import SuggestionPane from "/client/component/compound/suggestion-pane";
import {
  style
} from "/client/component/decorator";
import {
  Dictionary,
  Suggestion
} from "/server/skeleton/dictionary";


@style(require("./suggestion-list.scss"))
export default class SuggestionList extends Component<Props, State> {

  public render(): ReactNode {
    let displayedSuggestions = this.props.suggestions;
    let suggestionPanes = displayedSuggestions.map((suggestion, index) => {
      let suggestionPane = (
        <SuggestionPane
          dictionary={this.props.dictionary}
          suggestion={suggestion}
          key={index}
        />
      );
      return suggestionPane;
    });
    let node = (
      <ul styleName="root">
        {suggestionPanes}
      </ul>
    );
    return node;
  }

}


type Props = {
  dictionary: Dictionary,
  suggestions: Array<Suggestion>
};
type State = {
};