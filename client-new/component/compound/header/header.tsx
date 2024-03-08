//

import {faBook} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement} from "react";
import {AdditionalProps, GeneralIcon, LinkIconbag, useTrans} from "zographia";
import {Link} from "/client-new/component/atom/link";
import {Logo} from "/client-new/component/atom/logo";
import {SimpleLink} from "/client-new/component/atom/simple-link";
import {UserAvatar} from "/client-new/component/atom/user-avatar";
import {ChangeAppearanceForm} from "/client-new/component/compound/change-appearance-form";
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
          <nav styleName="navigation">
            <Link styleName="link" href="/dictionary" variant="unstyledUnderline">
              <LinkIconbag><GeneralIcon icon={faBook}/></LinkIconbag>
              {trans("dictionaryList")}
            </Link>
          </nav>
        </div>
        <div styleName="right">
          <div styleName="menu">
            <ChangeAppearanceForm/>
            <ChangeLocaleForm/>
          </div>
          {(me !== null) && (
            <div styleName="rightmost">
              <SimpleLink href={`/user/${me.name}`}>
                <UserAvatar styleName="avatar" user={me}/>
              </SimpleLink>
            </div>
          )}
        </div>
      </header>
    );

  }
);