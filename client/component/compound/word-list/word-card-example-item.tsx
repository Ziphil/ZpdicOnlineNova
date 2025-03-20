/* eslint-disable react/jsx-closing-bracket-location */

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCaretRight} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement} from "react";
import {AdditionalProps, MultiLineText, aria} from "zographia";
import {ExamplePopover} from "/client/component/compound/example-popover";
import {create} from "/client/component/create";
import {useResponse} from "/client/hook/request";
import {DictionaryWithExecutors, Example} from "/client/skeleton";


export const WordCardExampleItem = create(
  require("./word-card-example-item.scss"), "WordCardExampleItem",
  function ({
    dictionary,
    example,
    ...rest
  }: {
    dictionary: DictionaryWithExecutors,
    example: Example,
    className?: string
  } & AdditionalProps): ReactElement {

    const [offer] = useResponse("fetchExampleOfferOrNull", (example.offer) && example.offer);

    return (
      <li styleName="item" {...rest}>
        <span styleName="icon" {...aria({hidden: true})}>
          <FontAwesomeIcon icon={faCaretRight}/>
        </span>
        <ExamplePopover dictionary={dictionary} example={example} trigger={(
          <MultiLineText styleName="text" is="span">
            <span>
              {example.sentence}
            </span>
            <span styleName="separator"> — </span>
            <span>
              {(example.offer !== null) ? offer?.translation : example.translation}
            </span>
          </MultiLineText>
        )}/>
      </li>
    );

  }
);