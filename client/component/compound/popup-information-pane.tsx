//

import * as react from "react";
import {
  ReactNode
} from "react";
import {
  StoreComponent
} from "/client/component/component";
import {
  InformationPane
} from "/client/component/compound";
import {
  applyStyle,
  inject,
  observer,
  route
} from "/client/component/decorator";
import {
  getMessage
} from "/client/component/message";


@route @inject @observer
@applyStyle(require("./popup-information-pane.scss"))
export class PopupInformationPane extends StoreComponent<Props, State> {

  public render(): ReactNode {
    let specs = Array.from(this.props.store!.popupSpecs);
    let specNodes = specs.reverse().map((spec) => {
      let specNode = (
        <div styleName="pane-wrapper" key={spec.id}>
          <InformationPane texts={[getMessage(spec.type)]} style={spec.style} onClose={() => this.props.store!.clearPopup(spec.id)}/>
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