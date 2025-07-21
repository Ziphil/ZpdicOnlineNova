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
import {Example} from "/server/internal/skeleton";


export const ExampleCardInfoPopover = create(
  require("./example-card-info-popover.scss"), "ExampleCardInfoPopover",
  function ({
    trigger,
    example,
    ...rest
  }: {
    trigger: ReactElement,
    example: Example,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans, transDate} = useTrans("exampleList");

    return (
      <Popover styleName="root" trigger={trigger} placement="bottom-end" {...rest}>
        <div>
          <span styleName="number">
            <GeneralIcon styleName="number-icon" icon={faHashtag}/>
            {example.number}
          </span>
        </div>
        <dl styleName="table">
          <dt styleName="table-label">{trans("table.updatedDate")}</dt>
          <dd styleName="table-value"><time dateTime={dayjs(example.updatedDate).toISOString()}>{transDate(example.updatedDate)}</time></dd>
          <dt styleName="table-label">{trans("table.createdDate")}</dt>
          <dd styleName="table-value"><time dateTime={dayjs(example.createdDate).toISOString()}>{transDate(example.createdDate)}</time></dd>
        </dl>
      </Popover>
    );

  }
);