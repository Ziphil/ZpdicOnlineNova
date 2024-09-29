//

import {ReactElement, Ref} from "react";
import {AdditionalProps, aria, data} from "zographia";
import {Link} from "/client/component/atom/link";
import {UserAvatar} from "/client/component/atom/user-avatar";
import {createWithRef} from "/client/component/create";
import {useResponse} from "/client/hook/request";
import {ObjectId, User} from "/client/skeleton";


export const UserView = createWithRef(
  require("./user-view.scss"), "UserView",
  function ({
    user,
    variant = "bordered",
    ...rest
  }: {
    user: User | {id: ObjectId} | {name: string},
    variant?: "bordered" | "simple",
    className?: string,
    ref?: Ref<HTMLAnchorElement>
  } & AdditionalProps): ReactElement | null {

    const [innerUser] = useResponse("fetchUser", (needResponse(user)) && user);
    const actualUser = (needResponse(user)) ? innerUser : user;

    return (actualUser !== undefined) ? (
      <Link styleName="root" href={`/user/${actualUser.name}`} variant="unstyledSimple" {...data({subvariant: variant})} {...rest}>
        <span styleName="dummy" {...aria({hidden: true})}/>
        <UserAvatar styleName="avatar" user={actualUser}/>
        {actualUser.screenName}
      </Link>
    ) : null;

  }
);


function needResponse(user: User | {id: ObjectId} | {name: string}): user is {id: ObjectId} | {name: string} {
  return !("screenName" in user);
}