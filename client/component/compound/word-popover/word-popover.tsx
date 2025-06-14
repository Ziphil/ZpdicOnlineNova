/* eslint-disable react/jsx-closing-bracket-location */

import {MouseEvent, ReactElement, useCallback, useRef} from "react";
import {Popover} from "zographia";
import {EditWordDialog} from "/client/component/compound/edit-word-dialog";
import {EditWordInitialData} from "/client/component/compound/edit-word-form";
import {create} from "/client/component/create";
import {DictionaryWithExecutors, Word} from "/client/skeleton";
import {WordPopoverInner} from "./word-popover-inner";


export const WordPopover = create(
  require("./word-popover.scss"), "WordPopover",
  function ({
    dictionary,
    word,
    trigger,
    ...rest
  }: {
    dictionary: DictionaryWithExecutors,
    word: Word | {number: number},
    trigger: ReactElement,
    className?: string
  }): ReactElement {

    const triggerRef = useRef<(initialData: EditWordInitialData | null, event: MouseEvent<HTMLButtonElement>) => void>(null);

    const handleEdit = useCallback(function (word: Word, event: MouseEvent<HTMLButtonElement>): void {
      triggerRef.current?.({type: "word", word}, event);
    }, []);

    return (
      <>
        <Popover styleName="root" trigger={trigger} triggerType="hover" triggerRest={500} placement="bottom" {...rest}>
          <WordPopoverInner dictionary={dictionary} word={word} onEdit={handleEdit}/>
        </Popover>
        <EditWordDialog dictionary={dictionary} initialData={null} trigger={triggerRef}/>
      </>
    );

  }
);