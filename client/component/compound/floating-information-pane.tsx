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
  InformationPane
} from "/client/component/compound";
import {
  applyStyle
} from "/client/util/decorator";


@applyStyle(require("./floating-information-pane.scss"))
class FloatingInformationPaneBase extends ComponentBase<Props, State> {

  public render(): ReactNode {
    let node = (
      <div styleName="root">
        <div styleName="pane-wrapper">
          <InformationPane texts={["テストテキストです。"]} color="error"/>
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

export let FloatingInformationPane = withRouter(FloatingInformationPaneBase);