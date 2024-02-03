//

import {faBook, faSignIn, faUser} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement} from "react";
import {AdditionalProps, GeneralIcon, LinkIconbag, MultiLineText, aria, useTrans} from "zographia";
import {Link} from "/client-new/component/atom/link";
import {Logo} from "/client-new/component/atom/logo";
import {create} from "/client-new/component/create";
import {useMe} from "/client-new/hook/auth";
import {DECORATION_TEXT} from "./hero-constant";


export const Hero = create(
  require("./hero.scss"), "Hero",
  function ({
    ...rest
  }: {
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans, transNode} = useTrans("topPage");

    const me = useMe();

    return (
      <div styleName="root" {...rest}>
        <Logo styleName="logo"/>
        <MultiLineText styleName="catch" is="p" lineHeight="narrow">
          {transNode("catch", {
            line: (parts) => <span styleName="catch-line">{parts}</span>
          })}
        </MultiLineText>
        <div styleName="button-group">
          {(me !== null) ? (
            <Link styleName="button" href={`/user/${me.name}`} scheme="secondary" variant="light">
              <LinkIconbag><GeneralIcon icon={faUser}/></LinkIconbag>
              {trans("button.userPage")}
            </Link>
          ) : (
            <Link styleName="button" href="/login" scheme="secondary" variant="light">
              <LinkIconbag><GeneralIcon icon={faSignIn}/></LinkIconbag>
              {trans("button.login")}
            </Link>
          )}
          <Link styleName="link" href="/dictionary">
            <LinkIconbag><GeneralIcon icon={faBook}/></LinkIconbag>
            {trans("button.dictionary")}
          </Link>
        </div>
        <div styleName="decoration" {...aria({hidden: true})}>
          {DECORATION_TEXT}
        </div>
      </div>
    );

  }
);
