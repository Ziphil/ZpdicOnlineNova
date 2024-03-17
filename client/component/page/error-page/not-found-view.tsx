//

import {faCatSpace, faLeft} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement} from "react";
import {AdditionalProps, GeneralIcon, LinkIconbag, MultiLineText, useTrans} from "zographia";
import {Link} from "/client/component/atom/link";
import {create} from "/client/component/create";


export const NotFoundView = create(
  require("./not-found-view.scss"), "NotFoundView",
  function ({
    ...rest
  }: {
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("errorPage");

    return (
      <div styleName="root" {...rest}>
        <div styleName="top">
          <div styleName="code">404</div>
          <div styleName="icon">
            <GeneralIcon icon={faCatSpace}/>
          </div>
          <MultiLineText styleName="heading" is="div" lineHeight="narrowest">
            {trans("heading.notFound")}
          </MultiLineText>
        </div>
        <MultiLineText styleName="message">
          {trans("message.notFound")}
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
