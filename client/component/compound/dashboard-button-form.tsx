//

import * as react from "react";
import {
  ReactNode
} from "react";
import Button from "/client/component/atom/button";
import Component from "/client/component/component";
import {
  style
} from "/client/component/decorator";


@style(require("./dashboard-button-form.scss"))
export default class DashboardButtonForm extends Component<Props, State> {

  public state: State = {
    name: "",
    password: ""
  };

  private async performLogout(): Promise<void> {
    let response = await this.logout();
    if (response.status === 200) {
      this.pushPath("/");
    }
  }

  private async jumpDashboard(): Promise<void> {
    this.pushPath("/dashboard");
  }

  public render(): ReactNode {
    let node = (
      <form styleName="root">
        <div styleName="row">
          <Button label="ユーザーページへ" iconLabel="&#xE065;" onClick={this.jumpDashboard.bind(this)}/>
        </div>
        <div styleName="row">
          <Button label="ログアウト" iconLabel="&#xF2F5;" style="simple" onClick={this.performLogout.bind(this)}/>
        </div>
      </form>
    );
    return node;
  }

}


type Props = {
};
type State = {
};