//

import * as react from "react";
import {
  ReactElement,
  ReactNode
} from "react";
import {
  create
} from "/client/component-function/create";


const Tooltip = create(
  require("./tooltip.scss"), "Tooltip",
  function ({
    message,
    className,
    children
  }: {
    message: string | null
    className?: string,
    children?: ReactNode
  }): ReactElement {

    let tooltipNode = (message !== null) && (
      <div styleName="tooltip">
        <p styleName="tooltip-text">
          {message}
        </p>
      </div>
    );
    let node = (
      <div styleName="root" className={className}>
        {children}
        {tooltipNode}
      </div>
    );
    return node;

  }
);


export default Tooltip;