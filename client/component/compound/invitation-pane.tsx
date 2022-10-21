//

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
  invalidateQueries,
  usePopup,
  useRequest,
  useTrans
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
    invitation: Invitation,
    onSubmit?: (event: MouseEvent<HTMLButtonElement>) => AsyncOrSync<unknown>
  }): ReactElement {

    const {trans, transDate} = useTrans("invitationPane");
    const {request} = useRequest();
    const [, {addInformationPopup}] = usePopup();

    const respondInvitation = useCallback(async function (event: MouseEvent<HTMLButtonElement>, accept: boolean): Promise<void> {
      const id = invitation.id;
      const invitationType = invitation.type;
      const response = await request("respondInvitation", {id, accept});
      if (response.status === 200) {
        const type = (() => {
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
        await invalidateQueries("fetchInvitations", (data) => data.type === invitationType);
      }
    }, [invitation, request, onSubmit, addInformationPopup]);

    const name = invitation.dictionary.name;
    const createdDate = invitation.createdDate;
    const node = (
      <WhitePane clickable={false}>
        <div styleName="main">
          <div styleName="left">
            <div styleName="name">{name}</div>
            <div styleName="information">
              <div styleName="information-item">{trans("createdDate")} — {transDate(createdDate)}</div>
              <div styleName="information-item">{trans("userName")} — {invitation.dictionary.user.screenName}</div>
            </div>
          </div>
        </div>
        <div styleName="button-group">
          <Button label={trans("reject")} iconName="ban" scheme="red" reactive={true} onClick={(event) => respondInvitation(event, false)}/>
          <Button label={trans("accept")} iconName="thumbs-up" scheme="blue" reactive={true} onClick={(event) => respondInvitation(event, true)}/>
        </div>
      </WhitePane>
    );
    return node;

  }
);


export default InvitationPane;