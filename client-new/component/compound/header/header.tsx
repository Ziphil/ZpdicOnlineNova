//

import {ReactElement} from "react";
import {AdditionalProps} from "zographia";
import {Logo} from "/client-new/component/atom/logo";
import {SimpleLink} from "/client-new/component/atom/simple-link";
import {ChangeLocaleForm} from "/client-new/component/compound/change-locale-form";
import {create} from "/client-new/component/create";
import {useMe} from "/client-new/hook/auth";
import {VERSION} from "/client-new/variable";


export const Header = create(
  require("./header.scss"), "Header",
  function ({
    ...rest
  }: {
    className?: string
  } & AdditionalProps): ReactElement {

    const me = useMe();

    return (
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
          <div styleName="menu">
            <ChangeLocaleForm/>
          </div>
        </div>
      </header>
    );

  }
);