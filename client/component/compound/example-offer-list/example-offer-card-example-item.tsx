/* eslint-disable react/jsx-closing-bracket-location */

import {ReactElement} from "react";
import {AdditionalProps, MultiLineText, SingleLineText, useTrans} from "zographia";
import {Link} from "/client/component/atom/link";
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

    const {trans, transDate} = useTrans("exampleOfferList");

    return (
      <li styleName="root" {...rest}>
        <Link styleName="dictionary" href={`/dictionary/${example.dictionary.paramName || example.dictionary.number}`} variant="unstyledSimple">
          <SingleLineText>
            {example.dictionary.name}
          </SingleLineText>
        </Link>
        <MultiLineText styleName="sentence" is="p">
          {example.sentence}
        </MultiLineText>
      </li>
    );

  }
);