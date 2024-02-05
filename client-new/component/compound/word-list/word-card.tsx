//

import {faEdit, faTrashAlt} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement} from "react";
import {AdditionalProps, Button, ButtonIconbag, Card, CardBody, CardFooter, GeneralIcon, useTrans} from "zographia";
import {create} from "/client-new/component/create";
import {useResponse} from "/client-new/hook/request";
import {DetailedWord, EnhancedDictionary, Word} from "/client-new/skeleton";
import {WordCardEquivalentList} from "./word-card-equivalent-list";
import {WordCardExampleList} from "./word-card-example-list";
import {WordCardHeading} from "./word-card-heading";
import {useDiscardWord, useStartEditWord} from "./word-card-hook";
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

    const {trans} = useTrans("wordList");

    const [canEdit] = useResponse("fetchDictionaryAuthorization", {number: dictionary.number, authority: "edit"});

    const startEditWord = useStartEditWord(dictionary, word);
    const discardWord = useDiscardWord(dictionary, word);

    return (
      <Card styleName="root" {...rest}>
        <CardBody styleName="body">
          <WordCardHeading dictionary={dictionary} word={word}/>
          <WordCardEquivalentList dictionary={dictionary} word={word}/>
          <WordCardInformationList dictionary={dictionary} word={word}/>
          <WordCardExampleList dictionary={dictionary} word={word}/>
          <WordCardRelationList dictionary={dictionary} word={word}/>
        </CardBody>
        {(canEdit) && (
          <CardFooter styleName="footer">
            <Button scheme="primary" variant="light" onClick={startEditWord}>
              <ButtonIconbag><GeneralIcon icon={faEdit}/></ButtonIconbag>
              {trans("button.edit")}
            </Button>
            <Button scheme="red" variant="light" onClick={discardWord}>
              <ButtonIconbag><GeneralIcon icon={faTrashAlt}/></ButtonIconbag>
              {trans("button.discard")}
            </Button>
          </CardFooter>
        )}
      </Card>
    );

  }
);