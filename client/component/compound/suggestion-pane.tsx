//

import * as react from "react";
import {
  ReactNode
} from "react";
import Link from "/client/component/atom/link";
import {
  Component
} from "/client/component/component";
import {
  applyStyle,
  intl
} from "/client/component/decorator";
import {
  Dictionary,
  Suggestion
} from "/server/skeleton/dictionary";


@intl
@applyStyle(require("./suggestion-pane.scss"))
export default class SuggestionPane extends Component<Props, State> {

  public render(): ReactNode {
    let suggestion = this.props.suggestion;
    let href = "/dictionary/" + this.props.dictionary.number + "?search=" + encodeURIComponent(suggestion.word.name) + "&mode=name&type=exact&page=0";
    let nameNode = <Link href={href} target="self">{suggestion.word.name}</Link>;
    let title = suggestion.title;
    let node = (
      <li styleName="root">
        <span styleName="maybe">{this.trans("suggestionPane.maybe")}</span>
        {this.trans("suggestionPane.suggestion", {nameNode, title})}
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