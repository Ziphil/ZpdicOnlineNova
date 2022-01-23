//

import * as react from "react";
import {
  MouseEvent,
  ReactElement,
  ReactNode,
  useCallback
} from "react";
import {
  AsyncOrSync
} from "ts-essentials";
import InvitationPane from "/client/component-function/compound/invitation-pane";
import PaneList from "/client/component-function/compound/pane-list";
import {
  create
} from "/client/component-function/create";
import {
  Invitation
} from "/client/skeleton/invitation";


const InvitationList = create(
  require("./invitation-list.scss"), "InvitationList",
  function ({
    invitations,
    size,
    onSubmit
  }: {
    invitations: Array<Invitation> | null,
    size: number,
    onSubmit?: (event: MouseEvent<HTMLButtonElement>) => AsyncOrSync<void>
  }): ReactElement {

    let rendererInvitation = useCallback(function (invitation: Invitation): ReactNode {
      return <InvitationPane invitation={invitation} key={invitation.id} onSubmit={onSubmit}/>;
    }, [onSubmit]);

    let node = (
      <PaneList items={invitations} size={size} renderer={rendererInvitation}/>
    );
    return node;

  }
);


export default InvitationList;