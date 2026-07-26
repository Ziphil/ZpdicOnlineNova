/* eslint-disable react/jsx-closing-bracket-location */

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCaretRight} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement} from "react";
import {AdditionalProps, MultiLineText, aria, data} from "zographia";
import {ExamplePopover} from "/client/component/compound/example-popover";
import {create} from "/client/component/create";
import {useResponse} from "/client/hook/request";
import {Dictionary, DictionaryWithExecutors, Example} from "/server/internal/skeleton";


export const WordCardExampleItem = create(
  require("./word-card-example-item.scss"), "WordCardExampleItem",
  function ({
    dictionary,
    example,
    showPopover = true,
    ...rest
  }: {
    dictionary: Dictionary | DictionaryWithExecutors,
    example: Example,
    showPopover?: boolean,
    className?: string
  } & AdditionalProps): ReactElement {

    const [offer] = useResponse("fetchExampleOfferOrNull", (example.offer) && example.offer);

    return (
      <li styleName="item" {...rest}>
        <span styleName="icon" {...aria({hidden: true})}>
          <FontAwesomeIcon icon={faCaretRight}/>
        </span>
        <ExamplePopoverIfPossible dictionary={(showPopover && "akrantiain" in dictionary) ? dictionary : null} example={example} trigger={(
          <MultiLineText styleName="text" is="span">
            <span>
              <span className="dictionary-custom-font" {...data({target: "example"})}>{example.sentence}</span>
            </span>
            <span styleName="separator" {...aria({hidden: true})}/>
            <span>
              {(example.offer !== null) ? offer?.translation : example.translation}
            </span>
          </MultiLineText>
        )}/>
      </li>
    );

  }
);


const ExamplePopoverIfPossible = create(
  null, "ExamplePopoverIfPossible",
  function ({
    dictionary,
    example,
    trigger
  }: {
    dictionary: DictionaryWithExecutors | null,
    example: Example | null,
    trigger: ReactElement
  }): ReactElement {

    return (dictionary !== null && example !== null) ? (
      <ExamplePopover dictionary={dictionary} example={example} trigger={trigger}/>
    ) : (
      trigger
    );

  }
);