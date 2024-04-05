/* eslint-disable react/jsx-closing-bracket-location */

import {faClone, faEdit, faTrashAlt} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement} from "react";
import {AdditionalProps, Button, ButtonIconbag, Card, CardBody, CardFooter, GeneralIcon, useTrans} from "zographia";
import {EditWordDialog} from "/client/component/compound/edit-word-dialog";
import {create} from "/client/component/create";
import {useResponse} from "/client/hook/request";
import {WordWithExamples, DictionaryWithExecutors, Word} from "/client/skeleton";
import {WordCardEquivalentList} from "./word-card-equivalent-list";
import {WordCardExampleList} from "./word-card-example-list";
import {WordCardHeading} from "./word-card-heading";
import {useDiscardWord} from "./word-card-hook";
import {WordCardInformationList} from "./word-card-information-list";
import {WordCardRelationList} from "./word-card-relation-list";
import {WordCardVariationList} from "./word-card-variation-list";


export const WordCard = create(
  require("./word-card.scss"), "WordCard",
  function ({
    dictionary,
    word,
    ...rest
  }: {
    dictionary: DictionaryWithExecutors,
    word: Word | WordWithExamples,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("wordList");

    const [canEdit] = useResponse("fetchDictionaryAuthorization", {identifier: dictionary.number, authority: "edit"});

    const discardWord = useDiscardWord(dictionary, word);

    return (
      <Card styleName="root" {...rest}>
        <CardBody styleName="body">
          <WordCardHeading dictionary={dictionary} word={word}/>
          <WordCardEquivalentList dictionary={dictionary} word={word}/>
          <WordCardInformationList dictionary={dictionary} word={word}/>
          <WordCardExampleList dictionary={dictionary} word={word}/>
          {(word.variations.length > 0 || word.relations.length > 0) && (
            <div styleName="group">
              <WordCardVariationList dictionary={dictionary} word={word}/>
              <WordCardRelationList dictionary={dictionary} word={word}/>
            </div>
          )}
        </CardBody>
        {(canEdit) && (
          <CardFooter styleName="footer">
            <EditWordDialog dictionary={dictionary} initialData={{type: "word", word}} trigger={(
              <Button scheme="secondary" variant="underline">
                <ButtonIconbag><GeneralIcon icon={faEdit}/></ButtonIconbag>
                {trans("button.edit")}
              </Button>
            )}/>
            <EditWordDialog dictionary={dictionary} initialData={{type: "word", word}} forceAdd={true} trigger={(
              <Button scheme="secondary" variant="underline">
                <ButtonIconbag><GeneralIcon icon={faClone}/></ButtonIconbag>
                {trans("button.duplicate")}
              </Button>
            )}/>
            <Button scheme="red" variant="underline" onClick={discardWord}>
              <ButtonIconbag><GeneralIcon icon={faTrashAlt}/></ButtonIconbag>
              {trans("button.discard")}
            </Button>
          </CardFooter>
        )}
      </Card>
    );

  }
);