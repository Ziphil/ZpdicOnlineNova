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


@applyStyle(require("./menu-item.scss"))
class MenuItemBase extends ComponentBase<Props, State> {

  private click(event: MouseEvent<HTMLElement>): void {
    if (this.props.onClick) {
      this.props.onClick(event);
    }
    if (this.props.href) {
      this.props.history.push(this.props.href);
    }
  }

  public render(): ReactNode {
    let styleNames = ["menu-item"];
    if (this.props.highlight) {
      styleNames.push("highlight");
    }
    let node = (
      <a styleName={styleNames.join(" ")} onClick={this.click.bind(this)}>
        {this.props.label}
      </a>
    );
    return node;
  }

}


type Props = {
  label: string,
  highlight: boolean,
  href?: string,
  onClick?: (event: MouseEvent<HTMLElement>) => void;
};
type State = {
};

export let MenuItem = withRouter(MenuItemBase);