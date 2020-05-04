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
import {
  createStyleName
} from "/client/util/style-name";


@route @inject
@applyStyle(require("./menu-item.scss"))
export class MenuItem extends StoreComponent<Props, State> {

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
    let styleName = createStyleName(
      "root",
      {if: this.props.highlight, true: "highlight"}
    );
    let node = (
      <a styleName={styleName} href={this.props.href} onClick={this.handleClick.bind(this)}>
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
  highlight: boolean,
  href?: string,
  onClick?: (event: MouseEvent<HTMLElement>) => void;
};
type State = {
};