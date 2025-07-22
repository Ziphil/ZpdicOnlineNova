/* eslint-disable react/jsx-closing-bracket-location */

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCaretRight} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement} from "react";
import {AdditionalProps, Card, CardBody, MultiLineText, aria, useTrans} from "zographia";
import {Link} from "/client/component/atom/link";
import {create} from "/client/component/create";
import {getDictionaryIdentifier} from "/client/util/dictionary";
import {DictionaryWithExecutors, Suggestion} from "/server/internal/skeleton";


export const SuggestionCard = create(
  require("./suggestion-card.scss"), "SuggestionCard",
  function ({
    dictionary,
    suggestions,
    ...rest
  }: {
    dictionary: DictionaryWithExecutors,
    suggestions: Array<Suggestion>,
    className?: string
  } & AdditionalProps): ReactElement | null {

    const {trans, transNode} = useTrans("suggestionCard");

    return (suggestions.length > 0) ? (
      <Card styleName="root" {...rest}>
        <CardBody styleName="body">
          <h3 styleName="heading">{trans("maybe")}</h3>
          <ul styleName="list">
            {suggestions.map((suggestion, index) => (
              <li styleName="item" key={index}>
                <span styleName="icon" {...aria({hidden: true})}>
                  <FontAwesomeIcon icon={faCaretRight}/>
                </span>
                <MultiLineText styleName="text" is="span">
                  {(!!suggestion.title) ? transNode("message", {
                    title: suggestion.title,
                    mute: (parts) => <span styleName="mute">{parts}</span>,
                    nameNode: (
                      <Link href={`/dictionary/${getDictionaryIdentifier(dictionary)}?text=${encodeURIComponent(suggestion.word.name)}&mode=name&type=exact&page=0`} scheme="secondary" variant="underline">
                        {suggestion.word.name}
                      </Link>
                    )
                  }) : (
                    <Link href={`/dictionary/${getDictionaryIdentifier(dictionary)}?text=${encodeURIComponent(suggestion.word.name)}&mode=name&type=exact&page=0`} scheme="secondary" variant="underline">
                      {suggestion.word.name}
                    </Link>
                  )}
                </MultiLineText>
              </li>
            ))}
          </ul>
        </CardBody>
      </Card>
    ) : null;

  }
);