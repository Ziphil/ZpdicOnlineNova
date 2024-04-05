//

import {ReactElement, Ref} from "react";
import {AdditionalProps, aria} from "zographia";
import {Link} from "/client/component/atom/link";
import {UserAvatar} from "/client/component/atom/user-avatar";
import {createWithRef} from "/client/component/create";
import {useResponse} from "/client/hook/request";
import {User} from "/client/skeleton";


export const UserView = createWithRef(
  require("./user-view.scss"), "UserView",
  function ({
    user,
    ...rest
  }: {
    user: User | {name: string},
    className?: string,
    ref?: Ref<HTMLAnchorElement>
  } & AdditionalProps): ReactElement | null {

    const [innerUser] = useResponse("fetchUser", (!isFull(user)) && {name: user.name});
    const actualUser = (!isFull(user)) ? innerUser : user;

    return (actualUser !== undefined) ? (
      <Link styleName="root" href={`/user/${actualUser.name}`} variant="unstyledSimple" {...rest}>
        <span styleName="dummy" {...aria({hidden: true})}/>
        <UserAvatar styleName="avatar" user={actualUser}/>
        {actualUser.screenName}
      </Link>
    ) : null;

  }
);


function isFull(user: User | {name: string}): user is User {
  return "id" in user;
}