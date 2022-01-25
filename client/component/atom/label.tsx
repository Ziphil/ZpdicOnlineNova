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
  StyleNameUtil
} from "/client/util/style-name";


const Label = create(
  require("./label.scss"), "Label",
  function ({
    text,
    style = "normal",
    showRequired = false,
    showOptional = false,
    className
  }: {
    text?: string,
    style?: "normal" | "error",
    showRequired?: boolean,
    showOptional?: boolean,
    className?: string
  }): ReactElement | null {

    let [, {trans}] = useIntl();

    let styleName = StyleNameUtil.create(
      "root",
      {if: style === "error", true: "error"}
    );
    let requiredNode = (showRequired) && (
      <span styleName="required">({trans("label.required")})</span>
    );
    let optionalNode = (showOptional) && (
      <span styleName="optional">({trans("label.optional")})</span>
    );
    let node = (text !== undefined) && (
      <div styleName={styleName} className={className}>
        {text}
        {requiredNode}
        {optionalNode}
      </div>
    );
    return node || null;

  }
);


export default Label;