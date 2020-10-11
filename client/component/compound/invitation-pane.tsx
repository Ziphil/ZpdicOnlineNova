//

import * as react from "react";
import {
  MouseEvent,
  ReactNode
} from "react";
import {
  AsyncOrSync
} from "ts-essentials";
import Button from "/client/component/atom/button";
import Component from "/client/component/component";
import WhitePane from "/client/component/compound/white-pane";
import {
  style
} from "/client/component/decorator";
import {
  Invitation
} from "/server/skeleton/invitation";


@style(require("./invitation-pane.scss"))
export default class InvitationPane extends Component<Props, State> {

  private async respondInvitation(event: MouseEvent<HTMLButtonElement>, accept: boolean): Promise<void> {
    let id = this.props.invitation.id;
    let response = await this.requestPost("respondInvitation", {id, accept});
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
            <div styleName="information-item">{this.trans("invitationPane.createdDate")} — {this.transDate(createdDate)}</div>
            <div styleName="information-item">{this.trans("invitationPane.userName")} — {this.props.invitation.dictionary.user.screenName}</div>
          </div>
        </div>
        <div styleName="setting">
          <Button label={this.trans("invitationPane.reject")} iconLabel="&#xF05E;" style="caution" reactive={true} onClick={(event) => this.respondInvitation(event, false)}/>
          <Button label={this.trans("invitationPane.accept")} iconLabel="&#xF164;" style="information" reactive={true} onClick={(event) => this.respondInvitation(event, true)}/>
        </div>
      </WhitePane>
    );
    return node;
  }

}


type Props = {
  invitation: Invitation
  onSubmit?: (event: MouseEvent<HTMLButtonElement>) => AsyncOrSync<void>
};
type State = {
};