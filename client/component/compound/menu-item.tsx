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
@applyStyle(require("./menu-item.scss"))
class MenuItemBase extends StoreComponentBase<Props, State> {

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
    let styleNames = ["root"];
    if (this.props.highlight) {
      styleNames.push("highlight");
    }
    let node = (
      <a styleName={styleNames.join(" ")} href={this.props.href} onClick={this.click.bind(this)}>
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
  highlight: boolean,
  href?: string,
  onClick?: (event: MouseEvent<HTMLElement>) => void;
};
type State = {
};

export let MenuItem = withRouter(MenuItemBase);