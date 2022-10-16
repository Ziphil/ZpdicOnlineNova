//

import {
  ReactElement
} from "react";
import {
  create
} from "/client/component/create";
import {
  useIntl
} from "/client/component/hook";


export const Badge = create(
  require("./badge.scss"), "Badge",
  function ({
    value,
    className
  }: {
    value: string | number,
    className?: string
  }): ReactElement {

    const [, {transNumber}] = useIntl();

    const actualValue = (typeof value === "number") ? transNumber(value) : value;
    const node = (
      <span styleName="root" className={className}>
        {actualValue}
      </span>
    );
    return node;

  }
);


export default Badge;