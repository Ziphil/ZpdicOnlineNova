//

import {
  ReactElement,
  ReactNode
} from "react";
import {
  create
} from "/client/component/create";
import {
  data
} from "/client/util/data";


const ControlGroup = create(
  require("./control-group.scss"), "ControlGroup",
  function ({
    className,
    children
  }: {
    className?: string,
    children?: ReactNode
  }): ReactElement {

    const node = (
      <div styleName="root" className={className} {...data({controlGroup: true})}>
        {children}
      </div>
    );
    return node;

  }
);


export default ControlGroup;