/* eslint-disable react/jsx-closing-bracket-location */

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCaretRight} from "@fortawesome/sharp-solid-svg-icons";
import {ReactElement} from "react";
import {AdditionalProps, MultiLineText, aria} from "zographia";
import {DictionaryBadge} from "/client/component/atom/dictionary-badge";
import {create} from "/client/component/create";
import {ExampleWithDictionary} from "/client/skeleton";


export const ExampleOfferCardExampleItem = create(
  require("./example-offer-card-example-item.scss"), "ExampleOfferCardExampleItem",
  function ({
    example,
    ...rest
  }: {
    example: ExampleWithDictionary,
    className?: string
  } & AdditionalProps): ReactElement {

    return (
      <li styleName="root" {...rest}>
        <span styleName="icon" {...aria({hidden: true})}>
          <FontAwesomeIcon icon={faCaretRight}/>
        </span>
        <div styleName="main">
          <DictionaryBadge styleName="dictionary" dictionary={example.dictionary}/>
          <MultiLineText styleName="sentence" is="p">
            {example.sentence}
          </MultiLineText>
        </div>
      </li>
    );

  }
);