//

import {ReactElement} from "react";
import {AdditionalProps, Card, CardBody} from "zographia";
import {DetailedWord, Word} from "/client/skeleton/dictionary";
import {create} from "/client-new/component/create";
import {EnhancedDictionary} from "/client-new/skeleton";
import {WordCardEquivalentList} from "./word-card-equivalent-list";
import {WordCardHeading} from "./word-card-heading";
import {WordCardInformationList} from "./word-card-information-list";
import {WordCardRelationList} from "./word-card-relation-list";


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

    return (
      <Card styleName="root" {...rest}>
        <CardBody styleName="body">
          <WordCardHeading dictionary={dictionary} word={word}/>
          <WordCardEquivalentList dictionary={dictionary} word={word}/>
          <WordCardInformationList dictionary={dictionary} word={word}/>
          <WordCardRelationList dictionary={dictionary} word={word}/>
        </CardBody>
      </Card>
    );

  }
);