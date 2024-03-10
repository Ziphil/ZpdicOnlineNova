//

import {faBomb, faLeft} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement} from "react";
import {AdditionalProps, GeneralIcon, LinkIconbag, MultiLineText, useTrans} from "zographia";
import {Link} from "/client/component/atom/link";
import {create} from "/client/component/create";


export const ErrorView = create(
  require("./not-found-view.scss"), "ErrorView",
  function ({
    error,
    ...rest
  }: {
    error: unknown,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("errorPage");

    return (
      <div styleName="root" {...rest}>
        <div styleName="top">
          <div styleName="code"/>
          <div styleName="icon">
            <GeneralIcon icon={faBomb}/>
          </div>
          <div styleName="heading"/>
        </div>
        <MultiLineText styleName="message">
          {trans("message.error")}
        </MultiLineText>
        <pre styleName="error">
          {(error instanceof Error) ? `Error ${error.name}\n${error.message}\n\n${error.stack}` : JSON.stringify(error, null, 2)}
        </pre>
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
