//

import {ReactElement} from "react";
import {useParams} from "react-router-dom";
import {AdditionalProps} from "zographia";
import {InvitationList} from "/client-new/component/compound/invitation-list";
import {create} from "/client-new/component/create";
import {useMe} from "/client-new/hook/auth";
import {useSuspenseResponse} from "/client-new/hook/request";


export const UserNotificationPart = create(
  require("./user-notification-part.scss"), "UserNotificationPart",
  function ({
    ...rest
  }: {
    className?: string
  } & AdditionalProps): ReactElement | null {

    const me = useMe();
    const {name} = useParams();

    const [editInvitations] = useSuspenseResponse("fetchInvitations", {type: "edit"});
    const [transferInvitations] = useSuspenseResponse("fetchInvitations", {type: "transfer"});
    const invitations = [...editInvitations, ...transferInvitations];

    return (me !== null && me.name === name) ? (
      <div styleName="root" {...rest}>
        <section>
          <InvitationList invitations={invitations} pageSpec={{size: 40}}/>
        </section>
      </div>
    ) : null;

  }
);