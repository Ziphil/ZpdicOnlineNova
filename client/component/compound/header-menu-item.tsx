//

import * as react from "react";
import {
  MouseEvent,
  ReactNode
} from "react";
import Component from "/client/component/component";
import {
  applyStyle
} from "/client/component/decorator";


@applyStyle(require("./header-menu-item.scss"))
export default class HeaderMenuItem extends Component<Props, State> {

  public state: State = {
    userName: ""
  };

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
    let iconNode = (this.props.iconLabel !== undefined) && (
      <span styleName="icon">{this.props.iconLabel}</span>
    );
    let node = (
      <a styleName="root" href={this.props.href} onClick={this.handleClick.bind(this)}>
        {iconNode}
        <span styleName="text">{this.props.label}</span>
      </a>
    );
    return node;
  }

}


type Props = {
  label: string,
  iconLabel?: string,
  href: string,
  onClick?: (event: MouseEvent<HTMLElement>) => void;
};
type State = {
};