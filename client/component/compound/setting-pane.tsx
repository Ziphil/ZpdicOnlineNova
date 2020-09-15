//

import * as react from "react";
import {
  ReactNode
} from "react";
import Badge from "/client/component/atom/badge";
import {
  Component
} from "/client/component/component";
import {
  applyStyle
} from "/client/component/decorator";


@applyStyle(require("./setting-pane.scss"))
export default class SettingPane extends Component<Props, State> {

  public render(): ReactNode {
    let badgeNode = (this.props.badgeValue) && (
      <Badge value={this.props.badgeValue}/>
    );
    let descriptionNode = (this.props.description) && (
      <p styleName="description">
        {this.props.description}
      </p>
    );
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