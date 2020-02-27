//

import * as react from "react";
import {
  Component,
  ReactNode
} from "react";
import * as css from "react-css-modules";


@css(require("./logo.scss"))
export class Logo extends Component {

  public render(): ReactNode {
    return (
      <div styleName="logo">
        <div styleName="title">ZpDIC</div>
        <div styleName="subtitle">Online</div>
        <div styleName="version">ver 0.0.0</div>
      </div>
    );
  }

}