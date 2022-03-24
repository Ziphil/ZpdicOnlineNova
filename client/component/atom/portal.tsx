//

import * as react from "react";
import {
  ReactElement,
  ReactNode
} from "react";
import {
  createPortal
} from "react-dom";
import {
  create
} from "/client/component/create";
import {
  DataUtil
} from "/client/util/data";


const Portal = create(
  null, "Portal",
  function ({
    position = "front",
    children
  }: {
    position?: "front" | "back",
    children?: ReactNode
  }): ReactElement {

    let container = document.body;
    let data = DataUtil.create({position});
    let node = (
      <div className="portal" {...data}>
        {children}
      </div>
    );
    return createPortal(node, container);

  }
);


export default Portal;