//

import * as react from "react";
import {
  ReactElement,
  ReactNode
} from "react";
import {
  create
} from "/client/component-function/create";


const ControlGroup = create(
  require("./control-group.scss"), "ControlGroup",
  function ({
    className,
    children
  }: {
    className?: string,
    children?: ReactNode
  }): ReactElement {

    let node = (
      <div styleName="root" className={className}>
        {children}
      </div>
    );
    return node;

  }
);


export default ControlGroup;