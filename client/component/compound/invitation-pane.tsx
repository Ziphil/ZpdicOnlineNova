//

import * as react from "react";
import {
  MouseEvent,
  ReactElement,
  useCallback
} from "react";
import {
  AsyncOrSync
} from "ts-essentials";
import Button from "/client/component/atom/button";
import WhitePane from "/client/component/compound/white-pane";
import {
  create
} from "/client/component/create";
import {
  useIntl,
  usePopup,
  useRequest
} from "/client/component/hook";
import {
  Invitation
} from "/client/skeleton/invitation";


const InvitationPane = create(
  require("./invitation-pane.scss"), "InvitationPane",
  function ({
    invitation,
    onSubmit
  }: {
    invitation: Invitation
    onSubmit?: (event: MouseEvent<HTMLButtonElement>) => AsyncOrSync<void>
  }): ReactElement {

    let [, {trans, transDate}] = useIntl();
    let {request} = useRequest();
    let [, {addInformationPopup}] = usePopup();

    let respondInvitation = useCallback(async function (event: MouseEvent<HTMLButtonElement>, accept: boolean): Promise<void> {
      let id = invitation.id;
      let invitationType = invitation.type;
      let response = await request("respondInvitation", {id, accept});
      if (response.status === 200) {
        let type = (() => {
          if (invitationType === "edit") {
            return (accept) ? "editInvitationAccepted" : "editInvitationRefused";
          } else if (invitationType === "transfer") {
            return (accept) ? "transferInvitationAccepted" : "transferInvitationRefused";
          } else {
            return "messageNotFound";
          }
        })();
        addInformationPopup(type);
        await onSubmit?.(event);
      }
    }, [invitation, request, onSubmit, addInformationPopup]);

    let name = invitation.dictionary.name;
    let createdDate = invitation.createdDate;
    let node = (
      <WhitePane clickable={false}>
        <div>
          <div styleName="head">
            <div styleName="left">
              <div styleName="name">{name}</div>
            </div>
          </div>
          <div styleName="information">
            <div styleName="information-item">{trans("invitationPane.createdDate")} — {transDate(createdDate)}</div>
            <div styleName="information-item">{trans("invitationPane.userName")} — {invitation.dictionary.user.screenName}</div>
          </div>
        </div>
        <div styleName="setting">
          <Button label={trans("invitationPane.reject")} iconName="ban" variant="caution" reactive={true} onClick={(event) => respondInvitation(event, false)}/>
          <Button label={trans("invitationPane.accept")} iconName="thumbs-up" variant="information" reactive={true} onClick={(event) => respondInvitation(event, true)}/>
        </div>
      </WhitePane>
    );
    return node;

  }
);


export default InvitationPane;