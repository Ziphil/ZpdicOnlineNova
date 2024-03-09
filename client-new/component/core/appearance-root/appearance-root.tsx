//

import {ReactElement, ReactNode} from "react";
import {Root as ZographiaRoot} from "zographia";
import {create} from "/client-new/component/create";
import {useColorDefinitions} from "/client-new/hook/appearance";
import {messageInventory} from "/client-new/message";


export const AppearanceRoot = create(
  null, "AppearanceRoot",
  function ({
    children
  }: {
    children?: ReactNode
  }): ReactElement | null {

    const colorDefinitions = useColorDefinitions();

    return (
      <ZographiaRoot colorDefinitions={colorDefinitions} messageInventory={messageInventory}>
        {children}
      </ZographiaRoot>
    );

  }
);