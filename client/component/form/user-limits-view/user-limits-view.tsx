//

import {ReactElement} from "react";
import {AdditionalProps, ControlContainer, ControlLabel, useTrans} from "zographia";
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
          <ControlContainer label={false}>
            <ControlLabel>{trans("label.dictionaryCount")}</ControlLabel>
            <LimitView current={sizes.dictionary} max={me.limits.dictionaryCount}/>
          </ControlContainer>
          <ControlContainer label={false}>
            <ControlLabel>{trans("label.apiCredentialCount")}</ControlLabel>
            <LimitView current={sizes.apiCredential} max={me.limits.apiCredentialCount}/>
          </ControlContainer>
        </div>
      </div>
    );

  }
);
