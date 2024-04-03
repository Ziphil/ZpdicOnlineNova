//

import {faPenSwirl} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement, Ref} from "react";
import {AdditionalProps, Avatar, AvatarFallbackIconContainer, GeneralIcon} from "zographia";
import {createWithRef} from "/client/component/create";
import {useResponse} from "/client/hook/request";
import {User} from "/client/skeleton";
import {getAwsFileUrl} from "/client/util/aws";


export const UserAvatar = createWithRef(
  null, "UserAvatar",
  function ({
    user,
    inline,
    ...rest
  }: {
    user: User | {name: string},
    inline?: boolean,
    className?: string,
    ref?: Ref<HTMLSpanElement>
  } & AdditionalProps): ReactElement {

    const [innerUser] = useResponse("fetchUser", (!isFull(user)) && {name: user.name});
    const actualUser = (!isFull(user)) ? innerUser : user;

    const url = (actualUser) ? getAwsFileUrl(`avatar/${actualUser.name}/avatar`) : null;
    const hue = (actualUser) ? getIdHue(actualUser.id) : 0;

    return (
      <Avatar url={url} inline={inline} {...rest}>
        <AvatarFallbackIconContainer hue={hue}>
          <GeneralIcon icon={faPenSwirl}/>
        </AvatarFallbackIconContainer>
      </Avatar>
    );

  }
);


function isFull(user: User | {name: string}): user is User {
  return "id" in user;
}

function getIdHue(id: string): number {
  return parseInt(id.slice(0, 8), 16) % 360;
}