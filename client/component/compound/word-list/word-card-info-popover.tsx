/* eslint-disable react/jsx-closing-bracket-location */

import {faHashtag} from "@fortawesome/sharp-regular-svg-icons";
import dayjs from "dayjs";
import {ReactElement} from "react";
import {
  AdditionalProps,
  GeneralIcon,
  Popover,
  useTrans
} from "zographia";
import {create} from "/client/component/create";
import {Word, WordWithExamples} from "/server/internal/skeleton";


export const WordCardInfoPopover = create(
  require("./word-card-info-popover.scss"), "WordCardInfoPopover",
  function ({
    trigger,
    word,
    ...rest
  }: {
    trigger: ReactElement,
    word: Word | WordWithExamples,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans, transDate} = useTrans("wordList");

    return (
      <Popover styleName="root" trigger={trigger} placement="bottom-end" {...rest}>
        <div>
          <span styleName="number">
            <GeneralIcon styleName="number-icon" icon={faHashtag}/>
            {word.number}
          </span>
        </div>
        <dl styleName="table">
          <dt styleName="table-label">{trans("table.updatedDate")}</dt>
          <dd styleName="table-value"><time dateTime={dayjs(word.updatedDate).toISOString()}>{transDate(word.updatedDate)}</time></dd>
          <dt styleName="table-label">{trans("table.createdDate")}</dt>
          <dd styleName="table-value"><time dateTime={dayjs(word.createdDate).toISOString()}>{transDate(word.createdDate)}</time></dd>
        </dl>
      </Popover>
    );

  }
);