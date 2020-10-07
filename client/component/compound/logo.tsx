//

import * as react from "react";
import {
  ReactNode
} from "react";
import Component from "/client/component/component";
import {
  style
} from "/client/component/decorator";


@style(require("./logo.scss"))
export default class Logo extends Component<Props, State> {

  public render(): ReactNode {
    let version = process.env["npm_package_version"];
    let node = (
      <div styleName="root">
        <div styleName="title">ZpDIC</div>
        <div styleName="subtitle">Online</div>
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