//

import * as react from "react";
import {
  ReactNode
} from "react";
import {
  StoreComponent
} from "/client/component/component";
import InformationPane from "/client/component/compound/information-pane";
import {
  applyStyle,
  inject,
  intl,
  observer,
  route
} from "/client/component/decorator";
import {
  PopupUtil
} from "/client/util/popup";


@route @inject @intl @observer
@applyStyle(require("./popup-information-pane.scss"))
export default class PopupInformationPane extends StoreComponent<Props, State> {

  public render(): ReactNode {
    let specs = Array.from(this.props.store!.popupSpecs);
    let specNodes = specs.reverse().map((spec) => {
      let specNode = (
        <div styleName="pane-wrapper" key={spec.id}>
          <InformationPane texts={[PopupUtil.getMessage(this.props.intl!, spec.type)]} style={spec.style} onClose={() => this.props.store!.clearPopup(spec.id)}/>
        </div>
      );
      return specNode;
    });
    let node = (
      <div styleName="root">
        {specNodes}
      </div>
    );
    return node;
  }

}


type Props = {
};
type State = {
};