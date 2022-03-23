//

import * as react from "react";
import {
  ReactElement
} from "react";
import {
  create
} from "/client/component/create";
import {
  useIntl
} from "/client/component/hook";
import {
  DataUtil
} from "/client/util/data";


const Badge = create(
  require("./badge.scss"), "Badge",
  function ({
    value,
    variant = "normal",
    className
  }: {
    value: string | number,
    variant?: "normal" | "highlight",
    className?: string
  }): ReactElement {

    let [, {transNumber}] = useIntl();

    let actualValue = (typeof value === "number") ? transNumber(value) : value;
    let data = DataUtil.create({
      highlight: variant === "highlight"
    });
    let node = (
      <span styleName="root" className={className} {...data}>
        {actualValue}
      </span>
    );
    return node;

  }
);


export default Badge;