//

import {
  inject
} from "mobx-react";
import * as react from "react";
import {
  MouseEvent,
  ReactNode
} from "react";
import {
  withRouter
} from "react-router-dom";
import {
  StoreComponentBase
} from "/client/component/component";
import {
  applyStyle
} from "/client/util/decorator";


@inject("store")
@applyStyle(require("./header-menu-item.scss"))
class HeaderMenuItemBase extends StoreComponentBase<Props, State> {

  public state: State = {
    userName: ""
  };

  private click(event: MouseEvent<HTMLElement>): void {
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
      <a styleName="root" href={this.props.href} onClick={this.click.bind(this)}>
        <span styleName="text">{this.props.label}</span>
        <span styleName="icon">{this.props.iconLabel}</span>
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

export let HeaderMenuItem = withRouter(HeaderMenuItemBase);