//

import {ReactElement} from "react";
import {AdditionalProps, Avatar, useTrans} from "zographia";
import {Logo} from "/client-new/component/atom/logo";
import {SimpleLink} from "/client-new/component/atom/simple-link";
import {ChangeLocaleForm} from "/client-new/component/compound/change-locale-form";
import {create} from "/client-new/component/create";
import {useMe} from "/client-new/hook/auth";


export const Header = create(
  require("./header.scss"), "Header",
  function ({
    ...rest
  }: {
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("header");

    const me = useMe();

    return (
      <header styleName="root" {...rest}>
        <div styleName="left">
          <SimpleLink styleName="logo" href="/">
            <Logo/>
          </SimpleLink>
        </div>
        <div styleName="right">
          <div styleName="menu">
            <ChangeLocaleForm/>
          </div>
          {(me !== null) && (
            <div styleName="rightmost">
              <SimpleLink href={`/user/${me.name}`}>
                <Avatar styleName="avatar" url={null} alt={trans("userPage")}/>
              </SimpleLink>
            </div>
          )}
        </div>
      </header>
    );

  }
);