/* eslint-disable react/jsx-closing-bracket-location */

import {faCheck, faCircleInfo, faClone, faEdit, faShare, faTrashAlt} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement, useCallback} from "react";
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
  data,
  useResponsiveDevice,
  useTrans
} from "zographia";
import {EditWordDialog} from "/client/component/compound/edit-word-dialog";
import {ShareMenu} from "/client/component/compound/share-menu";
import {WordCardHeader} from "/client/component/compound/word-list/word-card-header";
import {WordCardInfoPopover} from "/client/component/compound/word-list/word-card-info-popover";
import {create} from "/client/component/create";
import {useResponse} from "/client/hook/request";
import {getWordHref} from "/client/util/dictionary";
import {toLatinNumeral} from "/client/util/misc";
import {DictionaryWithExecutors, OldWord, Word, WordWithExamples} from "/server/internal/skeleton";
import {WordCardEquivalentList} from "./word-card-equivalent-list";
import {WordCardExampleList} from "./word-card-example-list";
import {WordCardHeading} from "./word-card-heading";
import {useDiscardWord} from "./word-card-hook";
import {WordCardInformationList} from "./word-card-information-list";
import {WordCardPhraseList} from "./word-card-phrase-list";
import {WordCardRelationList} from "./word-card-relation-list";
import {WordCardVariationList} from "./word-card-variation-list";


export const WordCard = create(
  require("./word-card.scss"), "WordCard",
  function ({
    dictionary,
    word,
    showHeader,
    showInfo,
    showSelectButton,
    onSelect,
    ...rest
  }: {
    dictionary: DictionaryWithExecutors,
    word: Word | OldWord | WordWithExamples,
    showHeader: boolean,
    showInfo: boolean,
    showSelectButton: boolean,
    onSelect?: (word: Word) => void,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("wordList");

    const [authorities] = useResponse("fecthMyDictionaryAuthorities", {identifier: dictionary.number});

    const device = useResponsiveDevice();

    const shareText = `${word.spelling}\n#ZpDIC`;
    const shareUrl = location.origin + useHref(getWordHref(dictionary, word.number));

    const discardWord = useDiscardWord(dictionary, word);

    const handleSelect = useCallback(function (): void {
      onSelect?.(word);
    }, [onSelect, word]);

    return (
      <Card styleName="root" {...rest}>
        <CardBody styleName="body">
          {(showHeader) && (
            <WordCardHeader dictionary={dictionary} word={word}/>
          )}
          <WordCardHeading dictionary={dictionary} word={word}/>
          <Collapsible styleName="collapsible">
            <CollapsibleBody styleName="collapsible-body" height="20rem">
              <div styleName="section-list">
                {word.sections.map((section, index) => (
                  <div styleName="section-item" key={index}>
                    {(dictionary.settings.enableAdvancedWord && dictionary.settings.showSectionNumber) && (
                      <div styleName="section-number">{toLatinNumeral(index + 1)}</div>
                    )}
                    <div styleName="section-main" {...data({hasNumber: dictionary.settings.enableAdvancedWord && dictionary.settings.showSectionNumber})}>
                      <WordCardEquivalentList dictionary={dictionary} section={section}/>
                      <WordCardInformationList dictionary={dictionary} section={section}/>
                      <WordCardPhraseList dictionary={dictionary} section={section}/>
                      <WordCardVariationList dictionary={dictionary} section={section}/>
                      <WordCardRelationList dictionary={dictionary} section={section}/>
                    </div>
                  </div>
                ))}
              </div>
              <WordCardExampleList dictionary={dictionary} word={word}/>
            </CollapsibleBody>
            <CollapsibleButton styleName="collapsible-button"/>
          </Collapsible>
        </CardBody>
        {(showSelectButton) ? (
          <CardFooter styleName="footer">
            <div styleName="footer-left">
              <Button scheme="secondary" variant="underline" onClick={handleSelect}>
                <ButtonIconbag><GeneralIcon icon={faCheck}/></ButtonIconbag>
                {trans("button.select")}
              </Button>
            </div>
          </CardFooter>
        ) : (authorities?.includes("edit")) && (
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
              {(showInfo) && (
                <WordCardInfoPopover word={word} trigger={(device === "desktop") ? (
                  <Button scheme="secondary" variant="underline">
                    <ButtonIconbag><GeneralIcon icon={faCircleInfo}/></ButtonIconbag>
                    {trans("button.info")}
                  </Button>
                ) : (
                  <Button scheme="secondary" variant="underline">
                    <GeneralIcon icon={faCircleInfo}/>
                  </Button>
                )}/>
              )}
            </div>
          </CardFooter>
        )}
      </Card>
    );

  }
);