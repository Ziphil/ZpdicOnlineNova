//

import {
  ReactElement
} from "react";
import Link from "/client/component/atom/link";
import {
  create
} from "/client/component/create";
import {
  useTrans
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

    const {trans} = useTrans("suggestionPane");

    const href = "/dictionary/" + dictionary.number + "?text=" + encodeURIComponent(suggestion.word.name) + "&mode=name&type=exact&page=0";
    const nameNode = <Link href={href} target="self">{suggestion.word.name}</Link>;
    const title = suggestion.title;
    const node = (
      <li styleName="root">
        <span styleName="maybe">{trans("maybe")}</span>
        {trans("suggestion", {nameNode, title})}
      </li>
    );
    return node;

  }
);


export default SuggestionPane;