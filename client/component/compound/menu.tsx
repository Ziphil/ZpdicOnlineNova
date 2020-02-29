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
    let displayedMenu = this.props.displayedMenu;
    return (
      <nav styleName="menu">
        <MenuItem label="辞書一覧" href="/dashboard" displayed={displayedMenu === ""}/>
        <MenuItem label="設定" href="/dashboard/setting" displayed={displayedMenu === "setting"}/>
        <MenuItem label="ログアウト" onClick={this.performLogout} displayed={displayedMenu === "logout"}/>
      </nav>
    );
  }

}


type MenuProps = {
  displayedMenu: string
};