//

import * as react from "react";
import {
  Component,
  MouseEvent,
  ReactNode
} from "react";
import {
  RouteComponentProps,
  withRouter
} from "react-router-dom";
import {
  MenuItem
} from ".";
import {
  applyStyle
} from "../../util/decorator";
import * as http from "../../util/http";


@applyStyle(require("./menu.scss"))
class MenuBase extends Component<RouteComponentProps<{}> & Props, State> {

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