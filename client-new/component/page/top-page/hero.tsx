//

import {faBook, faSignIn} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement} from "react";
import {AdditionalProps, GeneralIcon, LinkIconbag, aria, useTrans} from "zographia";
import {Logo} from "/client-new/component/atom/logo";
import {TransitionLink} from "/client-new/component/atom/transition-link";
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
          <TransitionLink styleName="button" to="/login" scheme="secondary" variant="light">
            <LinkIconbag><GeneralIcon icon={faSignIn}/></LinkIconbag>
            {trans("button.login")}
          </TransitionLink>
          <TransitionLink styleName="link" to="/dictionary">
            <LinkIconbag><GeneralIcon icon={faBook}/></LinkIconbag>
            {trans("button.dictionary")}
          </TransitionLink>
        </div>
        <div styleName="decoration" {...aria({hidden: true})}>
          {DECORATION_TEXT}
        </div>
      </div>
    );

  }
);
