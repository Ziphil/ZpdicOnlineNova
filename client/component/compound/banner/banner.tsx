//

import {ReactElement, ReactNode} from "react";
import {AdditionalProps} from "zographia";
import {MainContainer} from "/client/component/compound/page";
import {create} from "/client/component/create";


export const Banner = create(
  require("./banner.scss"), "Banner",
  function ({
    children,
    ...rest
  }: {
    children?: ReactNode,
    className?: string
  } & AdditionalProps): ReactElement {

    return (
      <div styleName="root" {...rest}>
        <MainContainer styleName="container" width="normal">
          {children}
        </MainContainer>
      </div>
    );

  }
);
