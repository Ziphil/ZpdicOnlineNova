//

import {ReactElement} from "react";
import {AdditionalProps} from "zographia";
import {Logo} from "/client-new/component/atom/logo";
import {SimpleLink} from "/client-new/component/atom/simple-link";
import {create} from "/client-new/component/create";
import {VERSION} from "/client-new/variable";


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
          <SimpleLink styleName="logo" href="/">
            <Logo/>
          </SimpleLink>
          <div styleName="version">
            {VERSION}
          </div>
        </div>
        <div styleName="right">
        </div>
      </header>
    );
    return node;

  }
);