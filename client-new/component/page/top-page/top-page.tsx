//

import {ReactElement} from "react";
import {AdditionalProps} from "zographia";
import {Logo} from "/client-new/component/atom/logo";
import {create} from "/client-new/component/create";


export const TopPage = create(
  require("./top-page.scss"), "TopPage",
  function ({
    ...rest
  }: {
    className?: string
  } & AdditionalProps): ReactElement {

    return (
      <main styleName="root" {...rest}>
        <Logo/>
      </main>
    );

  }
);
