//

import * as react from "react";
import {
  Component,
  ReactNode
} from "react";
import {
  applyStyle
} from "../../util/decorator";


@applyStyle(require("./header.scss"))
export class Header extends Component<{}, {}> {

  public render(): ReactNode {
    return (
      <div styleName="header">
        <div styleName="left">
          <div styleName="title">ZpDIC</div>
        </div>
        <div styleName="right">
          dammy
        </div>
      </div>
    );
  }

}