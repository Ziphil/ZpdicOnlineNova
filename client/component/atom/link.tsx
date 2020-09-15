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
import {
  StyleNameUtil
} from "/client/util/style-name";


@applyStyle(require("./link.scss"))
export default class Link extends Component<Props, State> {

  public static defaultProps: DefaultProps = {
    target: "auto",
    style: "normal"
  };

  private handleClick(event: MouseEvent<HTMLAnchorElement>): void {
    event.preventDefault();
    let href = this.props.href;
    if (this.props.onClick) {
      this.props.onClick(event);
    }
    if (href) {
      let target = (() => {
        if (this.props.target === "auto") {
          if (href.includes(location.host) || (!href.startsWith("http") && !href.startsWith("//"))) {
            return "self";
          } else {
            return "blank";
          }
        } else {
          return this.props.target;
        }
      })();
      if (target === "self") {
        let shortHref = href.replace(/^(\w+?):\/\//, "").replace(location.host, "");
        this.pushPath(shortHref);
      } else {
        window.open(href);
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
  target: "self" | "blank" | "auto",
  style: "plane" | "normal",
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void,
  className?: string
};
type DefaultProps = {
  target: "self" | "blank" | "auto",
  style: "plane" | "normal"
};
type State = {
};