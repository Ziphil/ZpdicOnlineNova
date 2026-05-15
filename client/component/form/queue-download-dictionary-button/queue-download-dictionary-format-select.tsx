/* eslint-disable react/jsx-closing-bracket-location */

import {ReactElement} from "react";
import {AdditionalProps, Select, SelectOption, useTrans} from "zographia";
import {create} from "/client/component/create";


export const QueueDownloadDictionaryFormatSelect = create(
  require("../common.scss"), "QueueDownloadDictionaryFormatSelect",
  function ({
    type,
    onSet,
    ...rest
  }: {
    type: "slime" | "zpdic",
    onSet: (type: "slime" | "zpdic") => void,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("queueDownloadDictionaryButton");

    return (
      <Select styleName="select" value={type} onSet={onSet} {...rest}>
        <SelectOption value="slime" label={trans("label.format.slime")}>
          {trans("label.format.slime")}
        </SelectOption>
        <SelectOption value="zpdic" label={trans("label.format.zpdic")}>
          {trans("label.format.zpdic")}
        </SelectOption>
      </Select>
    );

  }
);
