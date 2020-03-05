//

import * as react from "react";
import {
  MouseEvent,
  ReactNode
} from "react";
import {
  withRouter
} from "react-router-dom";
import {
  ComponentBase
} from "/client/component/component";
import {
  applyStyle
} from "/client/util/decorator";


@applyStyle(require("./setting-pane.scss"))
class SettingPaneBase extends ComponentBase<Props, State> {

  public render(): ReactNode {
    let descriptionNode;
    if (this.props.description) {
      descriptionNode = (
        <p styleName="description">
          {this.props.description}
        </p>
      );
    }
    let node = (
      <div styleName="setting-pane">
        <div styleName="description-wrapper">
          <div styleName="label">{this.props.label}</div>
          {descriptionNode}
        </div>
        <div styleName="content">
          {this.props.children}
        </div>
      </div>
    );
    return node;
  }

}


type Props = {
  label: string,
  description?: string
};
type State = {
};

export let SettingPane = withRouter(SettingPaneBase);