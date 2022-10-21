//

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
  data
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

    const container = document.body;
    const node = (
      <div className="portal" {...data({position})}>
        {children}
      </div>
    );
    return createPortal(node, container);

  }
);


export default Portal;