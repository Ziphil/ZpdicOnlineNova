//

import * as react from "react";
import {
  ReactElement
} from "react";
import Link from "/client/component/atom/link";
import {
  create
} from "/client/component/create";
import {
  useIntl
} from "/client/component/hook";
import {
  Dictionary,
  Suggestion
} from "/client/skeleton/dictionary";


const SuggestionPane = create(
  require("./suggestion-pane.scss"), "SuggestionPane",
  function ({
    dictionary,
    suggestion
  }: {
    dictionary: Dictionary,
    suggestion: Suggestion
  }): ReactElement {

    let [, {trans}] = useIntl();

    let href = "/dictionary/" + dictionary.number + "?text=" + encodeURIComponent(suggestion.word.name) + "&mode=name&type=exact&page=0";
    let nameNode = <Link href={href} target="self">{suggestion.word.name}</Link>;
    let title = suggestion.title;
    let node = (
      <li styleName="root">
        <span styleName="maybe">{trans("suggestionPane.maybe")}</span>
        {trans("suggestionPane.suggestion", {nameNode, title})}
      </li>
    );
    return node;

  }
);


export default SuggestionPane;