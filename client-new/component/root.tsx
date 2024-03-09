//

import {ReactElement} from "react";
import {AppearanceRoot} from "/client-new/component/core/appearance-root";
import {ProviderRoot} from "/client-new/component/core/provider-root";
import {Routing} from "/client-new/component/core/routing";
import {create} from "/client-new/component/create";


require("./root.scss");


export const Root = create(
  null, "Root",
  function ({
  }: {
  }): ReactElement {

    return (
      <ProviderRoot>
        <AppearanceRoot>
          <Routing/>
        </AppearanceRoot>
      </ProviderRoot>
    );

  }
);