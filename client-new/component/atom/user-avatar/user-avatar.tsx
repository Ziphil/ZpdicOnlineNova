//

import {faPenSwirl} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement, Ref} from "react";
import {AdditionalProps, Avatar, AvatarFallbackIconContainer, GeneralIcon} from "zographia";
import {createWithRef} from "/client-new/component/create";
import {useResponse} from "/client-new/hook/request";
import {User} from "/client-new/skeleton";


export const UserAvatar = createWithRef(
  null, "UserAvatar",
  function ({
    user,
    ...rest
  }: {
    user: User | string,
    className?: string,
    ref?: Ref<HTMLSpanElement>
  } & AdditionalProps): ReactElement {

    const [innerUser] = useResponse("fetchOtherUser", (typeof user === "string") && {name: user});
    const actualUser = (typeof user === "string") ? innerUser : user;

    const hue = (actualUser !== undefined) ? getIdHue(actualUser.id) : 0;

    return (
      <Avatar url={null} {...rest}>
        <AvatarFallbackIconContainer hue={hue}>
          <GeneralIcon icon={faPenSwirl}/>
        </AvatarFallbackIconContainer>
      </Avatar>
    );

  }
);


function getIdHue(id: string): number {
  return parseInt(id.slice(0, 8), 16) % 360;
}