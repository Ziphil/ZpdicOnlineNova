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
  GlobalStore
} from "/client/component/store";
import {
  applyStyle
} from "/client/util/decorator";


@inject("store") @observer
@applyStyle(require("./floating-information-pane.scss"))
class FloatingInformationPaneBase extends ComponentBase<{store?: GlobalStore} & Props, State> {

  private determineText(type: string): string {
    let text = "奇妙なことが起こっています。";
    if (type === "emailChanged") {
      text = "メールアドレスの変更が完了しました。";
    }
    return text;
  }

  public render(): ReactNode {
    let node;
    let spec = this.props.store!.floatingSpec;
    if (spec) {
      let text = this.determineText(spec.type);
      node = (
        <div styleName="root">
          <div styleName="pane-wrapper">
            <InformationPane texts={[text]} color={spec.color}/>
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