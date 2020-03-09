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
  MenuItem
} from "/client/component/compound";
import {
  applyStyle
} from "/client/util/decorator";
import * as http from "/client/util/http";


@applyStyle(require("./menu.scss"))
class MenuBase extends ComponentBase<Props, State> {

  private async performLogout(event: MouseEvent<HTMLElement>): Promise<void> {
    let succeeded = await http.logout();
    if (succeeded) {
      this.props.history.push("/");
    }
  }

  public render(): ReactNode {
    let itemNodes = this.props.specs.map((spec, index) => {
      let highlight = spec.mode === this.props.mode;
      let href = (spec.mode === "logout") ? undefined : spec.href;
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

export let Menu = withRouter(MenuBase);