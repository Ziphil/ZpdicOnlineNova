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
  StyleNameUtil
} from "/client/util/style-name";


@route @inject
@applyStyle(require("./link.scss"))
export class Link extends StoreComponent<Props, State> {

  public static defaultProps: Partial<Props> = {
    target: "self",
    style: "normal"
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
    let styleName = StyleNameUtil.create(
      "root",
      {if: this.props.style === "plane", true: "plane"}
    );
    let node = (
      <a styleName={styleName} className={this.props.className} href={this.props.href} onClick={this.handleClick.bind(this)}>
        {this.props.children}
      </a>
    );
    return node;
  }

}


type Props = {
  href: string,
  target: "self" | "blank",
  style: "plane" | "normal",
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void,
  className?: string
};
type State = {
};