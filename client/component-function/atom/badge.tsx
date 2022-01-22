//

import * as react from "react";
import {
  ReactElement
} from "react";
import {
  create
} from "/client/component-function/create";
import {
  useIntl
} from "/client/component-function/hook";
import {
  StyleNameUtil
} from "/client/util/style-name";


const Badge = create(
  require("./badge.scss"), "Badge",
  function ({
    value,
    style = "normal",
    className
  }: {
    value: string | number,
    style?: "normal" | "highlight",
    className?: string
  }): ReactElement {

    let [, {transNumber}] = useIntl();

    let styleName = StyleNameUtil.create(
      "root",
      {if: style === "highlight", true: "highlight"}
    );
    let actualValue = (typeof value === "number") ? transNumber(value) : value;
    let node = (
      <span styleName={styleName} className={className}>
        {actualValue}
      </span>
    );
    return node;

  }
);


export default Badge;