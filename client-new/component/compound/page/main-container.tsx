//

import {ReactElement, ReactNode} from "react";
import {AdditionalProps, data} from "zographia";
import {create} from "/client-new/component/create";


export const MainContainer = create(
  require("./main-container.scss"), "MainContainer",
  function ({
    width = "normal",
    children,
    ...rest
  }: {
    width?: "normal" | "wide",
    children?: ReactNode,
    className?: string
  } & AdditionalProps): ReactElement {

    return (
      <div styleName="root" {...data({width})} {...rest}>
        {children}
      </div>
    );

  }
);