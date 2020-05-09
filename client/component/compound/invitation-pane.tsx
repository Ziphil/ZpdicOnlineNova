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
  DateUtil
} from "/client/util/date";
import {
  Invitation
} from "/server/skeleton/invitation";


@route @inject
@applyStyle(require("./invitation-pane.scss"))
export class InvitationPane extends StoreComponent<Props, State> {

  private async respondInvitation(event: MouseEvent<HTMLButtonElement>, accept: boolean): Promise<void> {
    let id = this.props.invitation.id;
    let response = await this.requestPost("respondEditDictionary", {id, accept});
    if (response.status === 200) {
      let type = (accept) ? "editDictionaryAccepted" : "editDictionaryRefused";
      this.props.store!.addInformationPopup(type);
      if (this.props.onSubmit) {
        await this.props.onSubmit(event);
      }
    }
  }

  public render(): ReactNode {
    let name = this.props.invitation.dictionary.name;
    let createdDate = this.props.invitation.createdDate;
    let node = (
      <WhitePane clickable={false}>
        <div>
          <div styleName="head">
            <div styleName="left">
              <div styleName="name">{name}</div>
            </div>
          </div>
          <div styleName="information">
            <div styleName="information-item">招待日時 — {DateUtil.format(createdDate, "yyyy/MM/dd HH:mm")}</div>
            <div styleName="information-item">招待者 — @{this.props.invitation.dictionary.userName}</div>
          </div>
        </div>
        <div styleName="setting">
          <Button label="拒否" iconLabel="&#xF05E;" style="caution" reactive={true} onClick={(event) => this.respondInvitation(event, false)}/>
          <Button label="承認" iconLabel="&#xF164;" style="information" reactive={true} onClick={(event) => this.respondInvitation(event, true)}/>
        </div>
      </WhitePane>
    );
    return node;
  }

}


type Props = {
  invitation: Invitation
  onSubmit?: (event: MouseEvent<HTMLButtonElement>) => void | Promise<void>
};
type State = {
};