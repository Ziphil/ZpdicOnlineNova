//

import {ReactElement} from "react";
import {AdditionalProps, List, ListBody, ListEmptyView, ListLoadingView, ListPagination, PageSpec, useTrans} from "zographia";
import {create} from "/client-new/component/create";
import {Invitation} from "/client-new/skeleton";
import {InvitationCard} from "./invitation-card";


export const InvitationList = create(
  require("./invitation-list.scss"), "InvitationList",
  function ({
    invitations,
    pageSpec,
    ...rest
  }: {
    invitations: Array<Invitation>,
    pageSpec: PageSpec,
    showUser?: boolean,
    showChart?: boolean,
    showAuthority?: boolean,
    showSettingLink?: boolean,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("invitationList");

    return (
      <List styleName="root" items={invitations} pageSpec={pageSpec} {...rest}>
        <ListBody styleName="body">
          {(invitation) => <InvitationCard key={invitation.id} invitation={invitation}/>}
          <ListLoadingView/>
          <ListEmptyView>
            {trans("empty")}
          </ListEmptyView>
        </ListBody>
        <ListPagination styleName="pagination"/>
      </List>
    );

  }
);