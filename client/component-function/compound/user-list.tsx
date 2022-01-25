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
import PaneList from "/client/component-function/compound/pane-list";
import UserPane from "/client/component-function/compound/user-pane";
import {
  create
} from "/client/component-function/create";
import {
  Dictionary
} from "/client/skeleton/dictionary";
import {
  User
} from "/client/skeleton/user";


const UserList = create(
  require("./user-list.scss"), "UserList",
  function ({
    users,
    dictionary,
    size,
    onSubmit
  }: {
    users: Array<User> | null,
    dictionary?: Dictionary,
    size: number,
    onSubmit?: (event: MouseEvent<HTMLButtonElement>) => AsyncOrSync<void>
  }): ReactElement {

    let renderUser = useCallback(function (user: User): ReactNode {
      return <UserPane user={user} dictionary={dictionary} key={user.id} onSubmit={onSubmit}/>;
    }, [dictionary, onSubmit]);

    let node = (
      <PaneList items={users} size={size} column={2} renderer={renderUser}/>
    );
    return node;

  }
);


export default UserList;