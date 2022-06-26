//

import * as react from "react";
import {
  MouseEvent,
  ReactElement
} from "react";
import {
  AsyncOrSync
} from "ts-essentials";
import PaneList from "/client/component/compound/pane-list-beta";
import UserPane from "/client/component/compound/user-pane";
import {
  create
} from "/client/component/create";
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
    users: Array<User>,
    dictionary?: Dictionary,
    size: number,
    onSubmit?: (event: MouseEvent<HTMLButtonElement>) => AsyncOrSync<void>
  }): ReactElement {

    const node = (
      <PaneList
        items={users}
        size={size}
        column={2}
      >
        {(user) => <UserPane user={user} dictionary={dictionary} key={user.id} onSubmit={onSubmit}/>}
      </PaneList>
    );
    return node;

  }
);


export default UserList;