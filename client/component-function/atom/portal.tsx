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
} from "/client/component-function/create";


const Portal = create(
  null, "Portal",
  function ({
    children
  }: {
    children?: ReactNode
  }): ReactElement {

    let container = document.getElementById("page") ?? document.body;
    let node = (
      <div className="portal">
        {children}
      </div>
    );
    return createPortal(node, container);

  }
);


export default Portal;