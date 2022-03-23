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
  StyleNameUtil
} from "/client/util/style-name";


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
    let className = StyleNameUtil.create("portal", position);
    let node = (
      <div className={className}>
        {children}
      </div>
    );
    return createPortal(node, container);

  }
);


export default Portal;