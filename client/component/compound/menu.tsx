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
  MenuItem
} from "/client/component/compound";
import {
  applyStyle,
  inject,
  route
} from "/client/component/decorator";


@route @inject
@applyStyle(require("./menu.scss"))
export class Menu extends StoreComponent<Props, State> {

  private async performLogout(): Promise<void> {
    let response = await this.logout();
    if (response.status === 200) {
      this.pushPath("/");
    }
  }

  public render(): ReactNode {
    let itemNodes = this.props.specs.map((spec, index) => {
      let highlight = spec.mode === this.props.mode;
      let href = (spec.mode !== "logout") ? spec.href : undefined;
      let onClick = (spec.mode === "logout") ? this.performLogout.bind(this) : undefined;
      return <MenuItem label={spec.label} iconLabel={spec.iconLabel} href={href} highlight={highlight} onClick={onClick} key={index}/>;
    });
    let node = (
      <nav styleName="root">
        {itemNodes}
      </nav>
    );
    return node;
  }

}


type Props = {
  mode: string,
  specs: Array<{mode: string, label: string, iconLabel: string, href: string}>
};
type State = {
};