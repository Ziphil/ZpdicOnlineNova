//

import {ReactElement} from "react";
import {AppearanceRoot} from "/client/component/core/appearance-root";
import {ProviderRoot} from "/client/component/core/provider-root";
import {Routing} from "/client/component/core/routing";
import {create} from "/client/component/create";


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