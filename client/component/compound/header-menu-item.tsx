//

import * as react from "react";
import {
  MouseEvent,
  ReactNode
} from "react";
import {
  StoreComponent
} from "/client/component/component";
import {
  applyStyle,
  inject,
  route
} from "/client/component/decorator";


@route @inject
@applyStyle(require("./header-menu-item.scss"))
export class HeaderMenuItem extends StoreComponent<Props, State> {

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
    let node = (
      <a styleName="root" href={this.props.href} onClick={this.handleClick.bind(this)}>
        <span styleName="icon">{this.props.iconLabel}</span>
        <span styleName="text">{this.props.label}</span>
      </a>
    );
    return node;
  }

}


type Props = {
  label: string,
  iconLabel: string,
  href: string,
  onClick?: (event: MouseEvent<HTMLElement>) => void;
};
type State = {
};