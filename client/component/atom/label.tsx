//

import {
  ReactElement
} from "react";
import {
  create
} from "/client/component/create";
import {
  useTrans
} from "/client/component/hook";
import {
  data
} from "/client/util/data";


const Label = create(
  require("./label.scss"), "Label",
  function ({
    text,
    variant = "normal",
    position = "top",
    showRequired = false,
    showOptional = false,
    className
  }: {
    text?: string,
    variant?: "normal" | "error",
    position?: "top" | "left",
    showRequired?: boolean,
    showOptional?: boolean,
    className?: string
  }): ReactElement | null {

    const {trans} = useTrans("label");

    const node = (text !== undefined) && (
      <div styleName="root" className={className} {...data({position, error: variant === "error"})}>
        {text}
        {(showRequired) && (
          <span styleName="required">({trans("required")})</span>
        )}
        {(showOptional) && (
          <span styleName="optional">({trans("optional")})</span>
        )}
      </div>
    );
    return node || null;

  }
);


export default Label;