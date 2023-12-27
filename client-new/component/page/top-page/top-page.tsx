//

import {ReactElement} from "react";
import {AdditionalProps} from "zographia";
import {create} from "/client-new/component/create";
import {Hero} from "./hero";


export const TopPage = create(
  require("./top-page.scss"), "TopPage",
  function ({
    ...rest
  }: {
    className?: string
  } & AdditionalProps): ReactElement {

    return (
      <main styleName="root" {...rest}>
        <Hero/>
      </main>
    );

  }
);
