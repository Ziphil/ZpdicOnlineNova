//

import {ReactElement} from "react";
import {useOutletContext} from "react-router";
import {AdditionalProps, useTrans} from "zographia";
import {create} from "/client/component/create";
import {UserLimitsView} from "/client/component/form/user-limits-view";
import {UserWithDetail} from "/server/internal/skeleton";


export const UserSettingLimitPart = create(
  require("./user-setting-limit-part.scss"), "UserSettingLimitPart",
  function ({
    ...rest
  }: {
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("userSettingLimitPart");

    const {me} = useOutletContext<{me: UserWithDetail}>();

    return (
      <div styleName="root" {...rest}>
        <section styleName="section">
          <h3 styleName="heading">{trans("heading.usage")}</h3>
          <UserLimitsView me={me}/>
        </section>
      </div>
    );

  }
);
