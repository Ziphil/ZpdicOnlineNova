//

import * as react from "react";
import {
  Component,
  MouseEvent,
  ReactNode
} from "react";
import {
  MenuItem
} from ".";
import {
  applyStyle
} from "../../util/decorator";
import * as http from "../../util/http";
import history from "../history";


@applyStyle(require("./menu.scss"))
export class Menu extends Component<MenuProps, {}> {

  private async performLogout(event: MouseEvent<HTMLDivElement>): Promise<void> {
    await http.logout();
    history.push("/");
  }

  public render(): ReactNode {
    let mode = this.props.mode;
    return (
      <nav styleName="menu">
        <MenuItem label="辞書一覧" href="/dashboard" highlight={mode === "dictionary"}/>
        <MenuItem label="設定" href="/dashboard/setting" highlight={mode === "setting"}/>
        <MenuItem label="ログアウト" onClick={this.performLogout} highlight={mode === "logout"}/>
      </nav>
    );
  }

}


type MenuProps = {
  mode: string
};