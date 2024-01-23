//

import {faCatSpace} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement} from "react";
import {AdditionalProps, GeneralIcon, MultiLineText, useTrans} from "zographia";
import {create} from "/client-new/component/create";


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
          <MultiLineText styleName="title" lineHeight="short">
            {trans("title.notFound")}
          </MultiLineText>
        </div>
        <MultiLineText styleName="message">
          {trans("message.notFound")}
        </MultiLineText>
      </div>
    );

  }
);
