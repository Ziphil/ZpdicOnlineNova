//

import {ReactElement} from "react";
import {Popover} from "zographia";
import {create} from "/client/component/create";
import {Dictionary, Word} from "/client/skeleton";
import {WordPopoverInner} from "./word-popover-inner";


export const WordPopover = create(
  require("./word-popover.scss"), "WordPopover",
  function ({
    dictionary,
    word,
    trigger,
    ...rest
  }: {
    dictionary: Dictionary,
    word: Word | {number: number},
    trigger: ReactElement,
    className?: string
  }): ReactElement {

    return (
      <Popover trigger={trigger} triggerType="hover" triggerRest={500} placement="bottom" {...rest}>
        <WordPopoverInner dictionary={dictionary} word={word}/>
      </Popover>
    );

  }
);