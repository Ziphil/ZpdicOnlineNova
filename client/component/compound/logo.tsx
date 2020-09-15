//

import * as react from "react";
import {
  ReactNode
} from "react";
import Component from "/client/component/component";
import {
  style
} from "/client/component/decorator";
import {
  TITLES,
  VERSION
} from "/client/index";


@style(require("./logo.scss"))
export default class Logo extends Component<Props, State> {

  public render(): ReactNode {
    let title = TITLES[0];
    let subtitle = TITLES[1];
    let version = VERSION.toString();
    let node = (
      <div styleName="root">
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