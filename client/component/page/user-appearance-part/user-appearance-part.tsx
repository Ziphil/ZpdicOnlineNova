//

import {ReactElement} from "react";
import {useParams} from "react-router-dom";
import {AdditionalProps} from "zographia";
import {create} from "/client/component/create";
import {useMe} from "/client/hook/auth";


export const UserAppearancePart = create(
  require("./user-appearance-part.scss"), "UserAppearancePart",
  function ({
    ...rest
  }: {
    className?: string
  } & AdditionalProps): ReactElement | null {

    const me = useMe();
    const {name} = useParams();

    return (me !== null && me.name === name) ? (
      <div styleName="root" {...rest}>
      </div>
    ) : null;

  }
);