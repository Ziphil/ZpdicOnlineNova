//

import {ReactElement, ReactNode} from "react";
import {AdditionalProps, List, ListBody, ListEmptyView, ListLoadingView, ListPagination, PageSpec} from "zographia";
import {create} from "/client/component/create";
import {User} from "/client/skeleton/user";
import {UserCard} from "./user-card";


export const UserList = create(
  require("./user-list.scss"), "UserList",
  function ({
    users,
    pageSpec,
    renderFooter,
    emptyMessage,
    ...rest
  }: {
    users: Array<User> | undefined,
    pageSpec: PageSpec,
    renderFooter?: (user: User) => ReactNode,
    emptyMessage?: string,
    className?: string
  } & AdditionalProps): ReactElement {

    return (
      <List styleName="root" items={users} pageSpec={pageSpec} {...rest}>
        <ListBody styleName="body">
          {(user) => <UserCard key={user.id} user={user} renderFooter={renderFooter}/>}
          <ListLoadingView styleName="loading"/>
          <ListEmptyView styleName="loading">
            {emptyMessage}
          </ListEmptyView>
        </ListBody>
        <ListPagination styleName="pagination"/>
      </List>
    );

  }
);