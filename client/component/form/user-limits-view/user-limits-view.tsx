//

import {ReactElement} from "react";
import {AdditionalProps, useTrans} from "zographia";
import {LimitView} from "/client/component/compound/limit-view";
import {create} from "/client/component/create";
import {useSuspenseResponse} from "/client/hook/request";
import {UserWithDetail} from "/server/internal/skeleton";


export const UserLimitsView = create(
  require("./user-limits-view.scss"), "UserLimitsView",
  function ({
    me,
    ...rest
  }: {
    me: UserWithDetail,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("userLimitsView");

    const [sizes] = useSuspenseResponse("fetchMySizes", {});

    return (
      <div styleName="root" {...rest}>
        <div styleName="list">
          <LimitView label={trans("label.dictionaryCount")} current={sizes.dictionary} max={me.limits.dictionaryCount}/>
          <LimitView label={trans("label.apiCredentialCount")} current={sizes.apiCredential} max={me.limits.apiCredentialCount}/>
        </div>
      </div>
    );

  }
);
