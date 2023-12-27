//

import {ReactElement, Suspense} from "react";
import {Root as ZographiaRoot} from "zographia";
import {create} from "/client-new/component/create";
import {TopPage} from "/client-new/component/page/top-page";
import {messageInventory} from "/client-new/message";


export const Root = create(
  null, "Root",
  function ({
  }: {
  }): ReactElement {

    return (
      <ZographiaRoot messageInventory={messageInventory}>
        <Suspense fallback={<div/>}>
          <TopPage/>
        </Suspense>
      </ZographiaRoot>
    );

  }
);