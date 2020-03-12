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
  getMessage
} from "/client/component/message";
import {
  applyStyle,
  inject,
  observer,
  route
} from "/client/util/decorator";


@route @inject @observer
@applyStyle(require("./popup-information-pane.scss"))
export class PopupInformationPane extends StoreComponent<Props, State> {

  public render(): ReactNode {
    let node;
    let spec = this.props.store!.popupSpec;
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