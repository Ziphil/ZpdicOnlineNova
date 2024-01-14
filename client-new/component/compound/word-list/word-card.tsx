//

import {ReactElement} from "react";
import {AdditionalProps, Card, CardBody} from "zographia";
import {create} from "/client-new/component/create";
import {DetailedWord, EnhancedDictionary, Word} from "/client-new/skeleton";
import {WordCardEquivalentList} from "./word-card-equivalent-list";
import {WordCardExampleList} from "./word-card-example-list";
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

    const hasOthers = word.informations.length > 0 || ("examples" in word && word.examples.length > 0) || word.relations.length > 0;

    return (
      <Card styleName="root" {...rest}>
        <CardBody styleName="body">
          <WordCardHeading dictionary={dictionary} word={word}/>
          <WordCardEquivalentList dictionary={dictionary} word={word}/>
          {(hasOthers) && <hr styleName="divider"/>}
          <WordCardInformationList dictionary={dictionary} word={word}/>
          <WordCardExampleList dictionary={dictionary} word={word}/>
          <WordCardRelationList dictionary={dictionary} word={word}/>
        </CardBody>
      </Card>
    );

  }
);