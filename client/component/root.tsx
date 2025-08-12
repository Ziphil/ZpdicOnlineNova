//

import {ReactElement} from "react";
import {GoogleAnalytics} from "zographia";
import {AppearanceRoot} from "/client/component/core/appearance-root";
import {ProviderRoot} from "/client/component/core/provider-root";
import {Routing} from "/client/component/core/routing";
import {create} from "/client/component/create";
import {ANALYTICS_ID} from "/client/variable";


require("./root.scss");


export const Root = create(
  null, "Root",
  function ({
  }: {
  }): ReactElement {

    return (
      <>
        {(!!ANALYTICS_ID) && <GoogleAnalytics measurementId={ANALYTICS_ID}/>}
        <ProviderRoot>
          <AppearanceRoot>
            <Routing/>
          </AppearanceRoot>
        </ProviderRoot>
      </>
    );

  }
);