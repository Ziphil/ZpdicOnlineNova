//

import * as react from "react";
import {
  MouseEvent,
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


@style(require("./menu-item.scss"))
export default class MenuItem extends Component<Props, State> {

  private handleClick(event: MouseEvent<HTMLElement>): void {
    event.preventDefault();
    if (this.props.onClick) {
      this.props.onClick(event);
    }
    if (this.props.href) {
      this.pushPath(this.props.href);
    }
  }

  public render(): ReactNode {
    let styleName = StyleNameUtil.create(
      "root",
      {if: this.props.highlight, true: "highlight"}
    );
    let badgeNode = (this.props.badgeValue) && (
      <Badge className={this.props.styles!["badge"]} value={this.props.badgeValue} style={(this.props.highlight) ? "highlight" : "normal"}/>
    );
    let node = (
      <a styleName={styleName} href={this.props.href} onClick={this.handleClick.bind(this)}>
        <span styleName="icon">{this.props.iconLabel}</span>
        <span styleName="text">{this.props.label}</span>
        {badgeNode}
      </a>
    );
    return node;
  }

}


type Props = {
  label: string,
  iconLabel: string,
  badgeValue?: string,
  highlight: boolean,
  href?: string,
  onClick?: (event: MouseEvent<HTMLElement>) => void;
};
type State = {
};