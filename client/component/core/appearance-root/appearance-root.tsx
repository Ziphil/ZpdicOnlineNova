//

import {ReactElement, ReactNode} from "react";
import {Root as ZographiaRoot} from "zographia";
import {create} from "/client/component/create";
import {useColorDefinitions} from "/client/hook/appearance";
import {messageInventory} from "/client/message";


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