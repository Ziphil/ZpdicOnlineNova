//

import * as react from "react";
import {
  ReactNode
} from "react";
import Badge from "/client/component/atom/badge";
import Component from "/client/component/component";
import {
  style
} from "/client/component/decorator";
import {
  StyleNameUtil
} from "/client/util/style-name";


@style(require("./setting-pane.scss"))
export default class SettingPane extends Component<Props, State> {

  public static defaultProps: DefaultProps = {
    forceWide: false
  };

  public render(): ReactNode {
    let styleName = StyleNameUtil.create([
      "root",
      {if: this.props.forceWide, true: "force-wide"}
    ]);
    let badgeNode = (this.props.badgeValue) && (
      <Badge value={this.props.badgeValue}/>
    );
    let descriptionNode = (this.props.description) && (
      <p styleName="description">
        {this.props.description}
      </p>
    );
    let descriptionWrapperNode = (this.props.label || this.props.description) && (
      <div styleName="description-wrapper">
        <div styleName="label">
          {this.props.label}
          {badgeNode}
        </div>
        {descriptionNode}
      </div>
    );
    let node = (
      <div styleName={styleName}>
        {descriptionWrapperNode}
        <div styleName="content">
          {this.props.children}
        </div>
      </div>
    );
    return node;
  }

}


type Props = {
  label?: string,
  badgeValue?: string | number,
  description?: ReactNode,
  forceWide: boolean
};
type DefaultProps = {
  forceWide: boolean
};
type State = {
};