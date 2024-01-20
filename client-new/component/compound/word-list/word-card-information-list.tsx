//

import {ReactElement} from "react";
import {AdditionalProps, MultiLineText} from "zographia";
import {Markdown} from "/client-new/component/atom/markdown";
import {create} from "/client-new/component/create";
import {DetailedWord, EnhancedDictionary, Word} from "/client-new/skeleton";


export const WordCardInformationList = create(
  require("./word-card-information-list.scss"), "WordCardInformationList",
  function ({
    dictionary,
    word,
    ...rest
  }: {
    dictionary: EnhancedDictionary,
    word: Word | DetailedWord,
    className?: string
  } & AdditionalProps): ReactElement | null {

    return (word.informations.length > 0) ? (
      <div styleName="root" {...rest}>
        {word.informations.map((information, index) => (
          <section key={index}>
            {(!!information.title) && (
              <h4 styleName="heading">
                {information.title}
              </h4>
            )}
            {(dictionary.settings.enableMarkdown) ? (
              <Markdown styleName="markdown" mode="normal">
                {information.text}
              </Markdown>
            ) : (
              <MultiLineText styleName="text">
                {information.text}
              </MultiLineText>
            )}
          </section>
        ))}
      </div>
    ) : null;

  }
);


function getPronunciation(dictionary: EnhancedDictionary, word: Word | DetailedWord): string | undefined {
  if (word.pronunciation !== undefined) {
    if (word.pronunciation.match(/^(\/.+\/|\[.+\])$/)) {
      return word.pronunciation;
    } else {
      return "/" + word.pronunciation + "/";
    }
  } else {
    if (dictionary.akrantiain !== null) {
      try {
        const pronunciation = dictionary.akrantiain.convert(word.name);
        return "/" + pronunciation + "/";
      } catch (error) {
        console.error(error);
        return undefined;
      }
    } else {
      return undefined;
    }
  }
}