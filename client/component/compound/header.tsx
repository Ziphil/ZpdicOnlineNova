//

import * as react from "react";
import {
  ReactNode
} from "react";
import {
  Link as RawLink,
  withRouter
} from "react-router-dom";
import {
  applyStyle
} from "../../util/decorator";
import {
  ComponentBase
} from "../component";


@applyStyle(require("./header.scss"))
class HeaderBase extends ComponentBase<Props, State> {

  public render(): ReactNode {
    let node = (
      <div styleName="header">
        <div styleName="left">
          <div styleName="title"><RawLink to="/">ZpDIC</RawLink></div>
        </div>
        <div styleName="right">
          dammy
        </div>
      </div>
    );
    return node;
  }

}


type Props = {
};
type State = {
};

export let Header = withRouter(HeaderBase);