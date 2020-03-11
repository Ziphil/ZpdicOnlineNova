//

import {
  inject,
  observer
} from "mobx-react";
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
  getMessage
} from "/client/component/message";
import {
  GlobalStore
} from "/client/component/store";
import {
  applyStyle
} from "/client/util/decorator";


@inject("store") @observer
@applyStyle(require("./floating-information-pane.scss"))
class FloatingInformationPaneBase extends ComponentBase<{store?: GlobalStore} & Props, State> {

  public render(): ReactNode {
    let node;
    let spec = this.props.store!.floatingSpec;
    if (spec) {
      node = (
        <div styleName="root">
          <div styleName="pane-wrapper">
            <InformationPane texts={[getMessage(spec.type)]} color={spec.color}/>
          </div>
        </div>
      );
    }
    return node;
  }

}


type Props = {
};
type State = {
};

export let FloatingInformationPane = withRouter(FloatingInformationPaneBase);