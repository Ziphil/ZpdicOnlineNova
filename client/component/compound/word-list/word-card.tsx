/* eslint-disable react/jsx-closing-bracket-location */

import {faClone, faEdit, faShare, faTrashAlt} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement} from "react";
import {useHref} from "react-router";
import {
  AdditionalProps,
  Button,
  ButtonIconbag,
  Card,
  CardBody,
  CardFooter,
  Collapsible,
  CollapsibleBody,
  CollapsibleButton,
  GeneralIcon,
  useResponsiveDevice,
  useTrans
} from "zographia";
import {EditWordDialog} from "/client/component/compound/edit-word-dialog";
import {ShareMenu} from "/client/component/compound/share-menu";
import {create} from "/client/component/create";
import {useResponse} from "/client/hook/request";
import {DictionaryWithExecutors, Word, WordWithExamples} from "/client/skeleton";
import {getDictionaryIdentifier} from "/client/util/dictionary";
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

    const device = useResponsiveDevice();

    const shareText = `${word.name}\n#ZpDIC`;
    const shareUrl = location.origin + useHref(`/dictionary/${getDictionaryIdentifier(dictionary)}?kind=exact&number=${word.number}`);

    const discardWord = useDiscardWord(dictionary, word);

    return (
      <Card styleName="root" {...rest}>
        <CardBody styleName="body">
          {word.updatedDate}
          {word.updatedUser}
          <WordCardHeading dictionary={dictionary} word={word}/>
          <Collapsible styleName="collapsible">
            <CollapsibleBody styleName="collapsible-body" height="20rem">
              <WordCardEquivalentList dictionary={dictionary} word={word}/>
              <WordCardInformationList dictionary={dictionary} word={word}/>
              <WordCardExampleList dictionary={dictionary} word={word}/>
              {(word.variations.length > 0 || word.relations.length > 0) && (
                <div styleName="group">
                  <WordCardVariationList dictionary={dictionary} word={word}/>
                  <WordCardRelationList dictionary={dictionary} word={word}/>
                </div>
              )}
            </CollapsibleBody>
            <CollapsibleButton styleName="collapsible-button"/>
          </Collapsible>
        </CardBody>
        {(canEdit) && (
          <CardFooter styleName="footer">
            <div styleName="footer-left">
              <EditWordDialog dictionary={dictionary} initialData={{type: "word", word}} trigger={(
                <Button scheme="secondary" variant="underline">
                  <ButtonIconbag><GeneralIcon icon={faEdit}/></ButtonIconbag>
                  {trans("button.edit")}
                </Button>
              )}/>
              <EditWordDialog dictionary={dictionary} initialData={{type: "word", word, forceAdd: true}} trigger={(
                <Button scheme="secondary" variant="underline">
                  <ButtonIconbag><GeneralIcon icon={faClone}/></ButtonIconbag>
                  {trans("button.duplicate")}
                </Button>
              )}/>
              <Button scheme="red" variant="underline" onClick={discardWord}>
                <ButtonIconbag><GeneralIcon icon={faTrashAlt}/></ButtonIconbag>
                {trans("button.discard")}
              </Button>
            </div>
            <div styleName="footer-right">
              <ShareMenu text={shareText} url={shareUrl} trigger={(device === "desktop") ? (
                <Button scheme="secondary" variant="underline">
                  <ButtonIconbag><GeneralIcon icon={faShare}/></ButtonIconbag>
                  {trans("button.share")}
                </Button>
              ) : (
                <Button scheme="secondary" variant="underline">
                  <GeneralIcon icon={faShare}/>
                </Button>
              )}/>
            </div>
          </CardFooter>
        )}
      </Card>
    );

  }
);