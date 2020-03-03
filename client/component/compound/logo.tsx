//

import * as react from "react";
import {
  ReactNode
} from "react";
import {
  withRouter
} from "react-router-dom";
import {
  ComponentBase
} from "/client/component/component";
import {
  TITLES,
  VERSION
} from "/client/index";
import {
  applyStyle
} from "/client/util/decorator";


@applyStyle(require("./logo.scss"))
class LogoBase extends ComponentBase<Props, State> {

  public render(): ReactNode {
    let title = TITLES[0];
    let subtitle = TITLES[1];
    let version = VERSION.toString();
    let node = (
      <div styleName="logo">
        <div styleName="title">{title}</div>
        <div styleName="subtitle">{subtitle}</div>
        <div styleName="version">ver {version}</div>
      </div>
    );
    return node;
  }

}


type Props = {
};
type State = {
};

export let Logo = withRouter(LogoBase);