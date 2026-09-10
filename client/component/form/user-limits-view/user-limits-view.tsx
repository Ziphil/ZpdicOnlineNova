//

import {faUp} from "@fortawesome/sharp-regular-svg-icons";
import {ReactElement} from "react";
import {AdditionalProps, Button, ButtonIconbag, ControlContainer, ControlLabel, GeneralIcon, useTrans} from "zographia";
import {ApplyIncreaseUserLimitDialog} from "/client/component/compound/apply-increase-user-limit-dialog";
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
        <ControlContainer label={false}>
          <ControlLabel>{trans("label.dictionaryCount")}</ControlLabel>
          <LimitView current={sizes.dictionary} max={me.limits.dictionaryCount}/>
        </ControlContainer>
        <ControlContainer label={false}>
          <ControlLabel>{trans("label.apiCredentialCount")}</ControlLabel>
          <LimitView current={sizes.apiCredential} max={me.limits.apiCredentialCount}/>
        </ControlContainer>
        <div styleName="button">
          <ApplyIncreaseUserLimitDialog
            me={me}
            trigger={(
              <Button variant="light">
                <ButtonIconbag><GeneralIcon icon={faUp}/></ButtonIconbag>
                {trans("button.apply")}
              </Button>
            )}
          />
        </div>
      </div>
    );

  }
);
