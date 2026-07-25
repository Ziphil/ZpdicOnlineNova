//

import {ReactElement} from "react";
import {AdditionalProps, Card, CardBody, data} from "zographia";
import {DictionaryBadge} from "/client/component/atom/dictionary-badge";
import {WordCardEquivalentList} from "/client/component/compound/word-list/word-card-equivalent-list";
import {WordCardExampleList} from "/client/component/compound/word-list/word-card-example-list";
import {WordCardHeading} from "/client/component/compound/word-list/word-card-heading";
import {WordCardInformationList} from "/client/component/compound/word-list/word-card-information-list";
import {WordCardPhraseList} from "/client/component/compound/word-list/word-card-phrase-list";
import {WordCardRelationList} from "/client/component/compound/word-list/word-card-relation-list";
import {WordCardVariationList} from "/client/component/compound/word-list/word-card-variation-list";
import {create} from "/client/component/create";
import {toLatinNumeral} from "/client/util/misc";
import {WordWithDictionary} from "/server/internal/skeleton";


export const SimpleWordCard = create(
  require("./simple-word-card.scss"), "SimpleWordCard",
  function ({
    word,
    ...rest
  }: {
    word: WordWithDictionary,
    className?: string
  } & AdditionalProps): ReactElement {

    const dictionary = word.dictionary;

    const showSectionNumber = dictionary.settings.enableAdvancedWord && (dictionary.settings.showSectionNumber === "show" || (dictionary.settings.showSectionNumber === "onlyNecessary" && word.sections.length >= 2));

    return (
      <Card {...rest}>
        <CardBody styleName="body">
          <DictionaryBadge styleName="dictionary" dictionary={dictionary}/>
          <WordCardHeading dictionary={dictionary} word={word}/>
          <div styleName="section-list">
            {word.sections.map((section, index) => (
              <div styleName="section-item" key={index}>
                {(showSectionNumber) && (
                  <div styleName="section-number">{toLatinNumeral(index + 1)}</div>
                )}
                <div styleName="section-main" {...data({hasNumber: showSectionNumber})}>
                  <WordCardEquivalentList dictionary={dictionary} section={section}/>
                  <WordCardInformationList dictionary={dictionary} section={section} showPopover={false}/>
                  <WordCardPhraseList dictionary={dictionary} section={section} showPopover={false}/>
                  <WordCardVariationList dictionary={dictionary} section={section}/>
                  <WordCardRelationList dictionary={dictionary} section={section} showPopover={false}/>
                </div>
              </div>
            ))}
          </div>
          <WordCardExampleList dictionary={dictionary} word={word} showPopover={false}/>
        </CardBody>
      </Card>
    );

  }
);
