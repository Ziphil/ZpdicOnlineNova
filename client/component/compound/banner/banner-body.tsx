//

import {ReactElement, ReactNode} from "react";
import {AdditionalProps} from "zographia";
import {create} from "/client/component/create";


export const BannerBody = create(
  require("./banner.scss"), "BannerBody",
  function ({
    children,
    ...rest
  }: {
    children?: ReactNode,
    className?: string
  } & AdditionalProps): ReactElement {

    return (
      <div styleName="content" {...rest}>
        {children}
      </div>
    );

  }
);
