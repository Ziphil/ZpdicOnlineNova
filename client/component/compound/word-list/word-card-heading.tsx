//

import {ReactElement, useMemo} from "react";
import {AdditionalProps, MultiLineText, Tag} from "zographia";
import {create} from "/client/component/create";
import {DictionaryWithExecutors, TemplateWord, Word, WordWithExamples} from "/server/internal/skeleton";


export const WordCardHeading = create(
  require("./word-card-heading.scss"), "WordCardHeading",
  function ({
    dictionary,
    word,
    ...rest
  }: {
    dictionary: DictionaryWithExecutors,
    word: Word | TemplateWord | WordWithExamples,
    className?: string
  } & AdditionalProps): ReactElement | null {

    const hasFont = dictionary.settings.font !== undefined && dictionary.settings.font.type !== "none";
    const pronunciation = useMemo(() => getPronunciation(dictionary, word), [dictionary, word]);
    const nameFontFamily = useMemo(() => getNameFontFamily(dictionary), [dictionary]);

    return (word.tags.length > 0 || !!word.name) ? (
      <div styleName="root" {...rest}>
        {(word.tags.length > 0) && (
          <div styleName="tag">
            {word.tags.map((tag, index) => (
              <Tag key={index} variant="solid">{tag}</Tag>
            ))}
          </div>
        )}
        {(!!word.name) && (
          <div styleName="name-container">
            <MultiLineText styleName="name" is="h3" lineHeight="narrowFixed" {...{style: {fontFamily: nameFontFamily}}}>
              {word.name}
            </MultiLineText>
            {(hasFont) && (
              <MultiLineText styleName="small-name" is="span" lineHeight="narrowFixed">
                {word.name}
              </MultiLineText>
            )}
            {(!!pronunciation) && (
              <MultiLineText styleName="pronunciation" lineHeight="narrow">
                {pronunciation}
              </MultiLineText>
            )}
          </div>
        )}
      </div>
    ) : null;

  }
);


function getPronunciation(dictionary: DictionaryWithExecutors, word: Word | TemplateWord | WordWithExamples): string | undefined {
  if (!!word.pronunciation) {
    if (word.pronunciation.match(/^(\/.+\/|\[.+\])$/)) {
      return word.pronunciation.trim();
    } else {
      return "/" + word.pronunciation.trim() + "/";
    }
  } else {
    if (dictionary.akrantiain !== null) {
      try {
        const pronunciation = dictionary.akrantiain.convert(word.name);
        return "/" + pronunciation.trim() + "/";
      } catch (error) {
        console.error(error);
        return undefined;
      }
    } else {
      return undefined;
    }
  }
}

function getNameFontFamily(dictionary: DictionaryWithExecutors): string | undefined {
  const font = dictionary.settings.font;
  if (font?.type === "custom") {
    return `'zpdic-custom-${dictionary.number}'`;
  } else if (font?.type === "local") {
    return `'${font.name}'`;
  } else {
    return undefined;
  }
}