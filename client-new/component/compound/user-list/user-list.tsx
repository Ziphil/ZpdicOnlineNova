//

import {ReactElement, ReactNode} from "react";
import {AdditionalProps, List, ListBody, ListEmptyView, ListPagination, PageSpec} from "zographia";
import {create} from "/client-new/component/create";
import {User} from "/client-new/skeleton/user";
import {UserCard} from "./user-card";


export const UserList = create(
  require("./user-list.scss"), "UserList",
  function ({
    users,
    pageSpec,
    renderFooter,
    ...rest
  }: {
    users: Array<User> | undefined,
    pageSpec: PageSpec,
    renderFooter?: (user: User) => ReactNode,
    className?: string
  } & AdditionalProps): ReactElement {

    return (
      <List styleName="root" items={users} pageSpec={pageSpec} {...rest}>
        <ListBody styleName="body">
          {(user) => <UserCard key={user.id} user={user} renderFooter={renderFooter}/>}
          <ListEmptyView/>
        </ListBody>
        <ListPagination styleName="pagination"/>
      </List>
    );

  }
);