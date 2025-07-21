/* eslint-disable react/jsx-closing-bracket-location */

import {faEdit} from "@fortawesome/sharp-regular-svg-icons";
import {MouseEvent, ReactElement, useCallback} from "react";
import {Button, ButtonIconbag, GeneralIcon, LoadingIcon, MultiLineText, Tag, useTrans} from "zographia";
import {create} from "/client/component/create";
import {useResponse} from "/client/hook/request";
import {createEquivalentNameNode} from "/client/util/dictionary";
import {DictionaryWithExecutors, Word} from "/server/internal/skeleton";


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
    onEdit?: (word: Word, event: MouseEvent<HTMLButtonElement>) => void,
    className?: string
  }): ReactElement {

    const {trans} = useTrans("wordPopover");

    const [authorities] = useResponse("fecthMyDictionaryAuthorities", {identifier: dictionary.number});

    const [innerWord] = useResponse("fetchWord", (!isFull(word)) && {number: dictionary.number, wordNumber: word.number});
    const actualWord = (!isFull(word)) ? innerWord : word;

    const handleEdit = useCallback(function (event: MouseEvent<HTMLButtonElement>): void {
      if (actualWord !== undefined) {
        onEdit?.(actualWord, event);
      }
    }, [actualWord, onEdit]);

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
        {(authorities?.includes("edit")) && (
          <div styleName="footer">
            <Button scheme="secondary" variant="underline" onClick={handleEdit}>
              <ButtonIconbag><GeneralIcon icon={faEdit}/></ButtonIconbag>
              {trans("button.edit")}
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