//

import {ReactElement} from "react";
import {Root as ZographiaRoot} from "zographia";
import {create} from "/client-new/component/create";
import {TopPage} from "/client-new/component/page/top-page";


export const Root = create(
  null, "Root",
  function ({
  }: {
  }): ReactElement {

    const node = (
      <ZographiaRoot>
        <TopPage/>
      </ZographiaRoot>
    );
    return node;

  }
);