//

import * as react from "react";
import {
  ReactNode
} from "react";
import {
  Link
} from "/client/component/atom";
import {
  Component
} from "/client/component/component";
import {
  applyStyle
} from "/client/component/decorator";
import {
  Dictionary,
  Suggestion
} from "/server/skeleton/dictionary";


@applyStyle(require("./suggestion-pane.scss"))
export class SuggestionPane extends Component<Props, State> {

  public render(): ReactNode {
    let suggestion = this.props.suggestion;
    let href = "/dictionary/" + this.props.dictionary.number + "?search=" + encodeURIComponent(suggestion.word.name) + "&mode=name&type=exact&page=0";
    let node = (
      <li styleName="root">
        <span styleName="maybe">もしかして</span>
        <Link href={href}>{suggestion.word.name}</Link> の
        {suggestion.title}?
      </li>
    );
    return node;
  }

}


type Props = {
  dictionary: Dictionary,
  suggestion: Suggestion
};
type State = {
};