//

import {ReactElement, useMemo} from "react";
import {AdditionalProps, MultiLineText, Tag, useTrans} from "zographia";
import {create} from "/client/component/create";
import {DictionaryWithExecutors, Word, WordWithExamples} from "/client/skeleton";


export const WordCardHeading = create(
  require("./word-card-heading.scss"), "WordCardHeading",
  function ({
    dictionary,
    word,
    ...rest
  }: {
    dictionary: DictionaryWithExecutors,
    word: Word | WordWithExamples,
    className?: string
  } & AdditionalProps): ReactElement {

    const {transNumber} = useTrans("wordCard");

    const debug = location.hostname === "localhost";
    const hasFont = dictionary.settings.font !== undefined && dictionary.settings.font.type !== "none";
    const pronunciation = useMemo(() => getPronunciation(dictionary, word), [dictionary, word]);
    const nameFontFamily = useMemo(() => getNameFontFamily(dictionary), [dictionary]);

    return (
      <div styleName="root" {...rest}>
        {(debug || word.tags.length > 0) && (
          <div styleName="tag">
            {(debug) && (
              <span styleName="number">#{transNumber(word.number)}</span>
            )}
            {word.tags.map((tag, index) => (
              <Tag key={index} variant="solid">{tag}</Tag>
            ))}
          </div>
        )}
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
            <div styleName="pronunciation">
              {pronunciation}
            </div>
          )}
        </div>
      </div>
    );

  }
);


function getPronunciation(dictionary: DictionaryWithExecutors, word: Word | WordWithExamples): string | undefined {
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