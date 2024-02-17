//

import {ReactElement} from "react";
import {useParams} from "react-router-dom";
import {AdditionalProps} from "zographia";
import {create} from "/client-new/component/create";
import {useMe} from "/client-new/hook/auth";


export const UserNotificationPart = create(
  require("./user-notification-part.scss"), "UserNotificationPart",
  function ({
    ...rest
  }: {
    className?: string
  } & AdditionalProps): ReactElement | null {

    const me = useMe();
    const {name} = useParams();

    return (me !== null && me.name === name) ? (
      <div styleName="root" {...rest}>
        UNDER CONSTRUCTION
      </div>
    ) : null;

  }
);