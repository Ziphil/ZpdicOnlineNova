//

import * as react from "react";
import {
  Component,
  ReactNode
} from "react";
import {
  Badge
} from "/client/component/atom";
import {
  applyStyle
} from "/client/component/decorator";


@applyStyle(require("./setting-pane.scss"))
export class SettingPane extends Component<Props, State> {

  public render(): ReactNode {
    let badgeNode;
    if (this.props.badgeValue) {
      badgeNode = <Badge value={this.props.badgeValue}/>;
    }
    let descriptionNode;
    if (this.props.description) {
      descriptionNode = (
        <p styleName="description">
          {this.props.description}
        </p>
      );
    }
    let node = (
      <div styleName="root">
        <div styleName="description-wrapper">
          <div styleName="label">
            {this.props.label}
            {badgeNode}
          </div>
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
  badgeValue?: string,
  description?: string
};
type State = {
};