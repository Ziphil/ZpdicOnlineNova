//

import * as react from "react";
import {
  MouseEvent,
  ReactElement
} from "react";
import {
  AsyncOrSync
} from "ts-essentials";
import InvitationPane from "/client/component/compound/invitation-pane";
import PaneList from "/client/component/compound/pane-list-beta";
import {
  create
} from "/client/component/create";
import {
  Invitation
} from "/client/skeleton/invitation";


const InvitationList = create(
  require("./invitation-list.scss"), "InvitationList",
  function ({
    invitations,
    size,
    hitSize,
    page,
    onPageSet,
    onSubmit
  }: {
    invitations: Array<Invitation>,
    size: number,
    hitSize?: number,
    page?: number,
    onPageSet?: (page: number) => void,
    onSubmit?: (event: MouseEvent<HTMLButtonElement>) => AsyncOrSync<unknown>
  }): ReactElement {

    const node = (
      <PaneList
        items={invitations}
        size={size}
        hitSize={hitSize}
        page={page}
        onPageSet={onPageSet}
        renderer={(invitation) => <InvitationPane key={invitation.id} invitation={invitation} onSubmit={onSubmit}/>}
      />
    );
    return node;

  }
);


export default InvitationList;