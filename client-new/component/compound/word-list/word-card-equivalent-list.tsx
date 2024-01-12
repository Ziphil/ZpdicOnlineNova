//

import {Fragment, ReactElement} from "react";
import {AdditionalProps, MultiLineText, Tag} from "zographia";
import {create} from "/client-new/component/create";
import {DetailedWord, EnhancedDictionary, Word} from "/client-new/skeleton";


export const WordCardEquivalentList = create(
  require("./word-card-equivalent-list.scss"), "WordCardEquivalentList",
  function ({
    dictionary,
    word,
    ...rest
  }: {
    dictionary: EnhancedDictionary,
    word: Word | DetailedWord,
    className?: string
  } & AdditionalProps): ReactElement | null {

    return (word.equivalents.length > 0) ? (
      <div styleName="root" {...rest}>
        {word.equivalents.map((equivalent, index) => (
          <MultiLineText styleName="text" key={index} is="div">
            {equivalent.titles.map((title, index) => (!!title) && (
              <Tag key={index} styleName="tag" variant="light">{title}</Tag>
            ))}
            {equivalent.names.map((name, index) => (
              <Fragment key={index}>
                {(index > 0) && <span styleName="punctuation"> · </span>}
                <span>{name}</span>
              </Fragment>
            ))}
          </MultiLineText>
        ))}
      </div>
    ) : null;

  }
);