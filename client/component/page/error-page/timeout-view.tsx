//

import {faArrowsRotate, faLeft, faPawSimple} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement} from "react";
import {AdditionalProps, Button, GeneralIcon, LinkIconbag, MultiLineText, useTrans} from "zographia";
import {Link} from "/client/component/atom/link";
import {create} from "/client/component/create";


export const TimeoutView = create(
  require("./not-found-view.scss"), "TimeoutView",
  function ({
    ...rest
  }: {
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("errorPage");

    return (
      <div styleName="root" {...rest}>
        <div styleName="top">
          <div styleName="code">408</div>
          <div styleName="icon">
            <GeneralIcon icon={faPawSimple}/>
          </div>
          <MultiLineText styleName="heading" is="div" lineHeight="narrowFixed">
            {trans("heading.timeout")}
          </MultiLineText>
        </div>
        <MultiLineText styleName="message">
          {trans("message.timeout")}
        </MultiLineText>
        <div styleName="button">
          <Link href="/" variant="light">
            <LinkIconbag><GeneralIcon icon={faLeft}/></LinkIconbag>
            {trans("button.back")}
          </Link>
          <Button variant="solid" onClick={() => window.location.reload()}>
            <LinkIconbag><GeneralIcon icon={faArrowsRotate}/></LinkIconbag>
            {trans("button.refresh")}
          </Button>
        </div>
      </div>
    );

  }
);
