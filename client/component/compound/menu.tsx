//

import * as react from "react";
import {
  ReactNode
} from "react";
import Component from "/client/component/component";
import MenuItem from "/client/component/compound/menu-item";
import {
  style
} from "/client/component/decorator";


@style(require("./menu.scss"))
export default class Menu extends Component<Props, State> {

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
      return <MenuItem label={spec.label} iconLabel={spec.iconLabel} badgeValue={spec.badgeValue} href={href} highlight={highlight} onClick={onClick} key={index}/>;
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
  specs: Array<{mode: string, label: string, iconLabel: string, badgeValue?: string | number, href: string}>
};
type State = {
};