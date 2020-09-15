//

import * as react from "react";
import {
  Fragment,
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
@applyStyle(require("./white-pane.scss"))
export default class WhitePane extends StoreComponent<Props, State> {

  private handleClickAnchor(event: MouseEvent<HTMLAnchorElement>): void {
    event.preventDefault();
    let path = event.currentTarget.attributes.getNamedItem("href")!.value;
    this.pushPath(path);
    if (this.props.onClick) {
      this.props.onClick(event);
    }
  }

  public render(): ReactNode {
    let innerNode = (() => {
      let children = this.props.children;
      if (Array.isArray(children)) {
        let actualChildren = children.filter((child) => child !== null && child !== undefined && child !== false);
        if (actualChildren.length >= 2) {
          let innerNode = (
            <Fragment>
              {actualChildren[0]}
              <hr styleName="separator"/>
              {actualChildren[1]}
            </Fragment>
          );
          return innerNode;
        } else {
          return actualChildren[0];
        }
      } else {
        return children;
      }
    })();
    let node = (() => {
      if (this.props.clickable) {
        let node = (
          <a styleName="root hoverable" href={this.props.href} onClick={this.handleClickAnchor.bind(this)}>
            {innerNode}
          </a>
        );
        return node;
      } else {
        let node = (
          <div styleName="root">
            {innerNode}
          </div>
        );
        return node;
      }
    })();
    return node;
  }

}


type Props = {
  clickable: boolean,
  href?: string,
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void
};
type State = {
};