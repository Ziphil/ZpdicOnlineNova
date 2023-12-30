//

import {ReactElement} from "react";
import {Link as RouterLink} from "react-router-dom";
import {AdditionalProps} from "zographia";
import {Logo} from "/client-new/component/atom/logo";
import {create} from "/client-new/component/create";


export const Header = create(
  require("./header.scss"), "Header",
  function ({
    ...rest
  }: {
    className?: string
  } & AdditionalProps): ReactElement {

    const node = (
      <header styleName="root" {...rest}>
        <div styleName="left">
          <RouterLink to="/">
            <Logo styleName="logo"/>
          </RouterLink>
        </div>
        <div styleName="right">
        </div>
      </header>
    );
    return node;

  }
);