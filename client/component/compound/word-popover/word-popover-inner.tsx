//

import {Fragment, ReactElement} from "react";
import {LoadingIcon, MultiLineText, Tag} from "zographia";
import {create} from "/client/component/create";
import {useResponse} from "/client/hook/request";
import {Dictionary, Word} from "/client/skeleton";


export const WordPopoverInner = create(
  require("./word-popover-inner.scss"), "WordPopoverInner",
  function ({
    dictionary,
    word,
    ...rest
  }: {
    dictionary: Dictionary,
    word: Word | {number: number},
    className?: string
  }): ReactElement {

    const [innerWord] = useResponse("fetchWord", (!isFull(word)) && {number: dictionary.number, wordNumber: word.number});
    const actualWord = (!isFull(word)) ? innerWord : word;

    return (actualWord !== undefined) ? (
      <div styleName="root" {...rest}>
        <div styleName="name">{actualWord.name}</div>
        <div styleName="equivalent-list">
          {actualWord.equivalents.map((equivalent, index) => (
            <MultiLineText styleName="equivalent-text" key={index} is="div">
              {equivalent.titles.map((title, index) => (!!title) && (
                <Tag key={index} styleName="tag" variant="light">{title}</Tag>
              ))}
              {equivalent.names.map((name, index) => (
                <Fragment key={index}>
                  {(index > 0) && <span styleName="punctuation">, </span>}
                  <span>{name}</span>
                </Fragment>
              ))}
            </MultiLineText>
          ))}
        </div>
      </div>
    ) : (
      <div styleName="root-loading">
        <LoadingIcon/>
      </div>
    );

  }
);


function isFull(word: Word | {number: number}): word is Word {
  return "name" in word && "equivalents" in word;
}