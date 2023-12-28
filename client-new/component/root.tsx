//

import {ReactElement} from "react";
import {Root as ZographiaRoot} from "zographia";
import {ProviderRoot} from "/client-new/component/core/provider-root";
import {Routing} from "/client-new/component/core/routing";
import {create} from "/client-new/component/create";
import {messageInventory} from "/client-new/message";


export const Root = create(
  null, "Root",
  function ({
  }: {
  }): ReactElement {

    return (
      <ZographiaRoot messageInventory={messageInventory}>
        <ProviderRoot>
          <Routing/>
        </ProviderRoot>
      </ZographiaRoot>
    );

  }
);