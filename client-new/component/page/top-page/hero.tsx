//

import {faBook, faSignIn} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement} from "react";
import {AdditionalProps, GeneralIcon, LinkIconbag, aria, useTrans} from "zographia";
import {Link} from "/client-new/component/atom/link";
import {Logo} from "/client-new/component/atom/logo";
import {create} from "/client-new/component/create";
import {DECORATION_TEXT} from "./hero-constant";


export const Hero = create(
  require("./hero.scss"), "Hero",
  function ({
    ...rest
  }: {
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("topPage");

    return (
      <div styleName="root" {...rest}>
        <Logo styleName="logo"/>
        <p styleName="catch">
          {trans("catch")}
        </p>
        <div styleName="button-group">
          <Link styleName="button" href="/login" scheme="secondary" variant="light">
            <LinkIconbag><GeneralIcon icon={faSignIn}/></LinkIconbag>
            {trans("button.login")}
          </Link>
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
