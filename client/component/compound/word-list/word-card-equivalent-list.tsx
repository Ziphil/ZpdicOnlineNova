//

import {Fragment, ReactElement} from "react";
import {AdditionalProps, MultiLineText, Tag} from "zographia";
import {create} from "/client/component/create";
import {DictionaryWithExecutors, Word, WordWithExamples} from "/client/skeleton";


export const WordCardEquivalentList = create(
  require("./word-card-equivalent-list.scss"), "WordCardEquivalentList",
  function ({
    dictionary,
    word,
    ...rest
  }: {
    dictionary: DictionaryWithExecutors,
    word: Word | WordWithExamples,
    className?: string
  } & AdditionalProps): ReactElement | null {

    const punctuation = getPunctuation(dictionary);

    return (word.equivalents.length > 0) ? (
      <div styleName="root" {...rest}>
        {word.equivalents.map((equivalent, index) => (
          <MultiLineText styleName="text" key={index} is="div">
            {equivalent.titles.map((title, index) => (!!title) && (
              <Tag key={index} styleName="tag" variant="light">{title}</Tag>
            ))}
            {equivalent.names.map((name, index) => (
              <Fragment key={index}>
                {(index > 0) && <span styleName="punctuation">{punctuation}</span>}
                <span>{name}</span>
              </Fragment>
            ))}
          </MultiLineText>
        ))}
      </div>
    ) : null;

  }
);


function getPunctuation(dictionary: DictionaryWithExecutors): string {
  const punctuation = dictionary.settings.punctuations[0] ?? ",";
  if (punctuation.match(/^[\x20-\x7E]*$/)) {
    return punctuation + " ";
  } else {
    return punctuation;
  }
}