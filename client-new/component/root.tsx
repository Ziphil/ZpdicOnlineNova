//

import {ReactElement} from "react";
import {Root as ZographiaRoot} from "zographia";
import {create} from "/client-new/component/create";


export const Root = create(
  null, "Root",
  function ({
  }: {
  }): ReactElement {

    const node = (
      <ZographiaRoot>
        HELLO!!
      </ZographiaRoot>
    );
    return node;

  }
);