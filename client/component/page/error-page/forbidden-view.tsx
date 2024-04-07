//

import {faLeft, faShieldCat} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement} from "react";
import {AdditionalProps, GeneralIcon, LinkIconbag, MultiLineText, useTrans} from "zographia";
import {Link} from "/client/component/atom/link";
import {create} from "/client/component/create";


export const ForbiddenView = create(
  require("./not-found-view.scss"), "ForbiddenView",
  function ({
    ...rest
  }: {
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("errorPage");

    return (
      <div styleName="root" {...rest}>
        <div styleName="top">
          <div styleName="code">403</div>
          <div styleName="icon">
            <GeneralIcon icon={faShieldCat}/>
          </div>
          <MultiLineText styleName="heading" is="div" lineHeight="narrowFixed">
            {trans("heading.forbidden")}
          </MultiLineText>
        </div>
        <MultiLineText styleName="message">
          {trans("message.forbidden")}
        </MultiLineText>
        <div styleName="button">
          <Link href="/" variant="solid">
            <LinkIconbag><GeneralIcon icon={faLeft}/></LinkIconbag>
            {trans("button.back")}
          </Link>
        </div>
      </div>
    );

  }
);
