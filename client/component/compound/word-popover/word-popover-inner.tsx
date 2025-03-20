/* eslint-disable react/jsx-closing-bracket-location */

import {faEdit} from "@fortawesome/sharp-regular-svg-icons";
import {MouseEvent, ReactElement} from "react";
import {Button, GeneralIcon, LoadingIcon, MultiLineText, Tag} from "zographia";
import {create} from "/client/component/create";
import {useResponse} from "/client/hook/request";
import {DictionaryWithExecutors, Word} from "/client/skeleton";
import {createEquivalentNameNode} from "/client/util/dictionary";


export const WordPopoverInner = create(
  require("./word-popover-inner.scss"), "WordPopoverInner",
  function ({
    dictionary,
    word,
    onEdit,
    ...rest
  }: {
    dictionary: DictionaryWithExecutors,
    word: Word | {number: number},
    onEdit?: (event: MouseEvent<HTMLButtonElement>) => void,
    className?: string
  }): ReactElement {

    const [canEdit] = useResponse("fetchDictionaryAuthorization", {identifier: dictionary.number, authority: "edit"});

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
              <span>
                {createEquivalentNameNode(equivalent.nameString, equivalent.ignoredPattern)}
              </span>
            </MultiLineText>
          ))}
        </div>
        {(canEdit) && (
          <div styleName="footer">
            <Button scheme="secondary" variant="underline" onClick={onEdit}>
              <GeneralIcon icon={faEdit}/>
            </Button>
          </div>
        )}
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