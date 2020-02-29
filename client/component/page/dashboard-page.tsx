//

import * as react from "react";
import {
  Component,
  ReactNode
} from "react";
import {
  applyStyle
} from "../../util/decorator";
import {
  Header,
  Menu
} from "../compound";


@applyStyle(require("./dashboard-page.scss"))
export class DashboardPage extends Component<{}, DashboardPageStatus> {

  public status: DashboardPageStatus = {
    displayedMenu: ""
  };

  public render(): ReactNode {
    return (
      <div styleName="dashboard-page">
        <Header/>
        <div styleName="content-wrapper">
          <Menu displayedMenu={this.status.displayedMenu}/>
          <div styleName="content">
            dammy
          </div>
        </div>
      </div>
    );
  }

}


type DashboardPageStatus = {
  displayedMenu: string
};