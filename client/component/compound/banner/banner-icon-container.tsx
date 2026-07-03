//

import {ReactElement, ReactNode} from "react";
import {AdditionalProps} from "zographia";
import {create} from "/client/component/create";


export const BannerIconContainer = create(
  require("./banner.scss"), "BannerIconContainer",
  function ({
    children,
    ...rest
  }: {
    children?: ReactNode,
    className?: string
  } & AdditionalProps): ReactElement {

    return (
      <div styleName="icon" {...rest}>
        {children}
      </div>
    );

  }
);
