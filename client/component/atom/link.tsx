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
} from "/client/util/decorator";


@route @inject
@applyStyle(require("./link.scss"))
export class Link extends StoreComponent<Props, State> {

  public static defaultProps: Partial<Props> = {
    color: null,
    target: "self"
  };

  private handleClick(event: MouseEvent<HTMLAnchorElement>): void {
    event.preventDefault();
    if (this.props.onClick) {
      this.props.onClick(event);
    }
    if (this.props.href) {
      if (this.props.target === "self") {
        this.pushPath(this.props.href);
      } else {
        window.open(this.props.href);
      }
    }
  }


  public render(): ReactNode {
    let styleNames = ["root"];
    if (this.props.color === "plane") {
      styleNames.push("plane");
    }
    let node = (
      <a styleName={styleNames.join(" ")} href={this.props.href} onClick={this.handleClick.bind(this)}>{this.props.label}</a>
    );
    return node;
  }

}


type Props = {
  label: string,
  href: string,
  target: "self" | "blank",
  color: "plane" | null,
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void
};
type State = {
};