//

import {ReactElement} from "react";
import {AdditionalProps, Card, CardBody, useTrans} from "zographia";
import {DetailedWord, Word} from "/client/skeleton/dictionary";
import {create} from "/client-new/component/create";
import {EnhancedDictionary} from "/client-new/skeleton";


export const WordCard = create(
  require("./word-card.scss"), "WordCard",
  function ({
    dictionary,
    word,
    ...rest
  }: {
    dictionary: EnhancedDictionary,
    word: Word | DetailedWord,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans, transNumber, transDate} = useTrans("wordList");

    return (
      <Card styleName="root" {...rest}>
        <CardBody styleName="body">
          {word.name}
        </CardBody>
      </Card>
    );

  }
);