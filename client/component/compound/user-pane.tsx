//

import * as react from "react";
import {
  MouseEvent,
  ReactNode
} from "react";
import {
  Button
} from "/client/component/atom";
import {
  StoreComponent
} from "/client/component/component";
import {
  WhitePane
} from "/client/component/compound";
import {
  applyStyle,
  inject,
  route
} from "/client/component/decorator";
import {
  User
} from "/server/skeleton/user";


@route @inject
@applyStyle(require("./user-pane.scss"))
export class UserPane extends StoreComponent<Props, State> {

  private async respondInvitation(event: MouseEvent<HTMLButtonElement>): Promise<void> {
    let response = await this.requestPost("logout", {});
    if (response.status === 200) {
      if (this.props.onSubmit) {
        await this.props.onSubmit(event);
      }
    }
  }

  public render(): ReactNode {
    let node = (
      <WhitePane clickable={false}>
        <div>
          <div styleName="head">
            <div styleName="right">
              <div styleName="image"/>
            </div>
            <div styleName="left">
              <div styleName="screen-name">@{this.props.user.name}</div>
              <div styleName="name">@{this.props.user.name}</div>
            </div>
          </div>
        </div>
        <div styleName="setting">
          <Button label="追放" iconLabel="&#xF05E;" style="caution" reactive={true} onClick={(event) => this.respondInvitation(event)}/>
        </div>
      </WhitePane>
    );
    return node;
  }

}


type Props = {
  user: User,
  onSubmit?: (event: MouseEvent<HTMLButtonElement>) => void | Promise<void>
};
type State = {
};