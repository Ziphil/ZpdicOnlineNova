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
    await http.logout();
    this.props.history.push("/");
  }

  public render(): ReactNode {
    let mode = this.props.mode;
    let node = (
      <nav styleName="menu">
        <MenuItem label="辞書一覧" href="/dashboard" highlight={mode === "dictionary"}/>
        <MenuItem label="設定" href="/dashboard/setting" highlight={mode === "setting"}/>
        <MenuItem label="ログアウト" onClick={this.performLogout.bind(this)} highlight={mode === "logout"}/>
      </nav>
    );
    return node;
  }

}


type Props = {
  mode: string
};
type State = {
};

export let Menu = withRouter(MenuBase);