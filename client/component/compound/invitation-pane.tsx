//

import * as react from "react";
import {
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
  DateUtil
} from "/client/util/date";
import {
  AccessInvitation
} from "/server/skeleton/access-invitation";


@route @inject
@applyStyle(require("./invitation-pane.scss"))
export class InvitationPane extends StoreComponent<Props, State> {

  public render(): ReactNode {
    let name = this.props.invitation.dictionary.name;
    let createdDate;
    let node = (
      <WhitePane clickable={false}>
        <div>
          <div styleName="head">
            <div styleName="left">
              <div styleName="name">{name}</div>
            </div>
          </div>
          <div styleName="information">
            <div styleName="information-item">招待日時 — {(createdDate !== undefined) ? DateUtil.format(createdDate, "yyyy/MM/dd HH:mm") : "?"}</div>
            <div styleName="information-item">招待者 — @{this.props.invitation.dictionary.userName}</div>
          </div>
        </div>
        <div styleName="setting">
          <Button label="拒否" iconLabel="&#xF05E;" style="caution"/>
          <Button label="承認" iconLabel="&#xF164;" style="information"/>
        </div>
      </WhitePane>
    );
    return node;
  }

}


type Props = {
  invitation: AccessInvitation
};
type State = {
};