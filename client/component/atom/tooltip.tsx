//

import * as react from "react";
import {
  ReactElement,
  ReactNode
} from "react";
import {
  create
} from "/client/component/create";


const Tooltip = create(
  require("./tooltip.scss"), "Tooltip",
  function ({
    message,
    className,
    children
  }: {
    message: string | null,
    className?: string,
    children?: ReactNode
  }): ReactElement {

    let node = (
      <div styleName="root" className={className}>
        {children}
        {(message !== null) && (
          <div styleName="tooltip">
            <p styleName="tooltip-text">
              {message}
            </p>
          </div>
        )}
      </div>
    );
    return node;

  }
);


export default Tooltip;