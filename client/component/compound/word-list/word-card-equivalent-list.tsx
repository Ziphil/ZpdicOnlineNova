//

import {ReactElement} from "react";
import {AdditionalProps, MultiLineText, Tag} from "zographia";
import {create} from "/client/component/create";
import {DictionaryWithExecutors, Word, WordWithExamples} from "/client/skeleton";
import {createEquivalentNameNode} from "/client/util/dictionary";


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

    return (word.equivalents.length > 0) ? (
      <div styleName="root" {...rest}>
        {word.equivalents.map((equivalent, index) => (
          <MultiLineText styleName="text" key={index} is="div">
            {equivalent.titles.map((title, index) => (!!title) && (
              <Tag key={index} styleName="tag" variant="light">{title}</Tag>
            ))}
            <span>
              {createEquivalentNameNode(equivalent.nameString, equivalent.ignoredPattern)}
            </span>
          </MultiLineText>
        ))}
      </div>
    ) : null;

  }
);