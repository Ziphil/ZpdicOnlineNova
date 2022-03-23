//

import * as react from "react";
import {
  ReactElement,
  ReactNode
} from "react";
import {
  create
} from "/client/component/create";
import { DataUtil } from "/client/util/data";


const ControlGroup = create(
  require("./control-group.scss"), "ControlGroup",
  function ({
    className,
    children
  }: {
    className?: string,
    children?: ReactNode
  }): ReactElement {

    let data = DataUtil.create({controlGroup: true});
    let node = (
      <div styleName="root" className={className} {...data}>
        {children}
      </div>
    );
    return node;

  }
);


export default ControlGroup;